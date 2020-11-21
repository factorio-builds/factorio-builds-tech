using FactorioTech.Web.Core;
using FactorioTech.Web.Core.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text.Json;

namespace FactorioTech.Web.Data
{
    public class AppDbContext : IdentityDbContext<User, Role, Guid>
    {
        public DbSet<Blueprint> Blueprints { get; set; }
        public DbSet<BlueprintVersion> BlueprintVersions { get; set; }

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
                entity.HasMany<Blueprint>()
                    .WithOne(x => x.Owner!)
                    .HasForeignKey(x => x.OwnerId)
                    .HasPrincipalKey(x => x.Id);
            });

            builder.Entity<Blueprint>(entity =>
            {
                entity.HasMany<BlueprintVersion>().WithOne()
                    .HasForeignKey(e => e.BlueprintId)
                    .HasPrincipalKey(e => e.Id);

                entity.HasOne(e => e.LatestVersion!).WithMany()
                    .HasPrincipalKey(e => e.Id);

                entity.HasAlternateKey(e => new { e.OwnerId, e.Slug });
            });

            builder.Entity<BlueprintVersion>(entity =>
            {
                entity.Property(e => e.Payload)
                    .HasConversion(
                        envelope => JsonSerializer.Serialize(envelope, BlueprintConverter.JsonSerializerOptions),
                        json => JsonSerializer.Deserialize<FactorioApi.BlueprintEnvelope>(json, BlueprintConverter.JsonSerializerOptions)!)
                    .HasColumnType("jsonb");

                entity.HasAlternateKey(e => e.Hash);
            });
        }

        private void CustomizeAspNetIdentity(ModelBuilder builder)
        {
            builder.Entity<User>(entity =>
            {
                entity.Property(e => e.UserName).HasMaxLength(100).IsRequired();
                entity.Property(e => e.NormalizedUserName).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Email).IsRequired();
                entity.Property(e => e.NormalizedEmail).IsRequired();
            });

            builder.Entity<Role>(entity =>
            {
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
