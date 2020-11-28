using FactorioTech.Web.Core.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NodaTime;
using System;

namespace FactorioTech.Web.Data
{
    public class AppDbContext : IdentityDbContext<User, Role, Guid>
    {
        public DbSet<Blueprint> Blueprints { get; set; }
        public DbSet<BlueprintVersion> BlueprintVersions { get; set; }
        public DbSet<BlueprintPayload> BlueprintPayloads { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Tag> Tags { get; set; }

#pragma warning disable 8618
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
#pragma warning restore 8618

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            CustomizeAspNetIdentity(builder);

            builder.Entity<User>(entity =>
            {
                entity.HasMany(e => e.Blueprints!)
                    .WithOne(e => e.Owner!)
                    .HasForeignKey(e => e.OwnerId)
                    .HasPrincipalKey(e => e.Id);

                entity.HasMany(e => e.Favorites).WithMany(x => x.Followers)
                    .UsingEntity<Favorite>(
                        je => je.HasOne(e => e.Blueprint!).WithMany()
                            .HasForeignKey(x => x.BlueprintId)
                            .HasPrincipalKey(x => x.BlueprintId),
                        je => je.HasOne(e => e.User!).WithMany()
                            .HasForeignKey(x => x.UserId)
                            .HasPrincipalKey(x => x.Id))
                    .HasKey(e => new { e.UserId, e.BlueprintId });

                entity.Property(e => e.TimeZone)
                    .HasConversion(
                        tz => tz!.Id,
                        tz => DateTimeZoneProviders.Tzdb[tz]);
            });

            builder.Entity<Favorite>(entity =>
            {
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("timezone('utc', now())");
            });

            builder.Entity<Blueprint>(entity =>
            {
                entity.HasAlternateKey(e => new { e.OwnerId, e.Slug });

                entity.HasOne(e => e.LatestVersion!).WithMany()
                    .HasForeignKey(e => e.LatestVersionId)
                    .HasPrincipalKey(e => e.VersionId);

                entity.HasMany(e => e.Tags).WithOne()
                    .HasForeignKey(e => e.BlueprintId)
                    .HasPrincipalKey(e => e.BlueprintId);

                entity.HasGeneratedTsVectorColumn(
                        e => e.SearchVector,
                        "english",
                        e => new { e.Title, e.Description, e.Slug })
                    .HasIndex(b => b.SearchVector)
                    .HasMethod("GIN");
            });

            builder.Entity<BlueprintVersion>(entity =>
            {
                entity.HasAlternateKey(e => e.Hash);

                entity.HasOne(x => x.Blueprint!).WithMany()
                    .HasForeignKey(e => e.BlueprintId)
                    .HasPrincipalKey(e => e.BlueprintId);

                entity.Property(e => e.Hash)
                    .HasConversion(e => e.ToString(), e => new Hash(e));
            });

            builder.Entity<BlueprintPayload>(entity =>
            {
                entity.Property(e => e.Hash)
                    .HasConversion(e => e.ToString(), e => new Hash(e));

                entity.HasOne<BlueprintVersion>().WithOne(e => e.Payload!)
                    .HasForeignKey<BlueprintPayload>(e => e.Hash)
                    .HasPrincipalKey<BlueprintVersion>(e => e.Hash);
            });

            builder.Entity<Tag>(entity =>
            {
                entity.HasKey(e => new { e.BlueprintId, e.Value });
            });
        }

        private void CustomizeAspNetIdentity(ModelBuilder builder)
        {
            builder.Entity<User>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("UserId");
                entity.Property(e => e.UserName).HasMaxLength(100).IsRequired();
                entity.Property(e => e.NormalizedUserName).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Email).IsRequired();
                entity.Property(e => e.NormalizedEmail).IsRequired();
            });

            builder.Entity<Role>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("RoleId");
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.NormalizedName).IsRequired();
            });

            builder.Entity<IdentityUserLogin<Guid>>(entity =>
            {
                entity.Property(e => e.ProviderDisplayName).IsRequired();
            });
        }
    }
}
