using FactorioTech.Core.Domain;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Extensions;
using IdentityServer4.EntityFramework.Interfaces;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NodaTime;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Core.Data
{
    public class AppDbContext : IdentityDbContext<User, Role, Guid>, IPersistedGrantDbContext
    {
        public DbSet<PersistedGrant> PersistedGrants { get; set; }
        public DbSet<DeviceFlowCodes> DeviceFlowCodes { get; set; }

        public DbSet<Blueprint> Blueprints { get; set; }
        public DbSet<BlueprintVersion> BlueprintVersions { get; set; }
        public DbSet<BlueprintPayload> BlueprintPayloads { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Tag> Tags { get; set; }

        private const string IdentitySchema = "identity";
        private readonly IOptions<OperationalStoreOptions> _operationalStoreOptions;

#pragma warning disable 8618
        public AppDbContext(DbContextOptions<AppDbContext> options, IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options)
        {
            _operationalStoreOptions = operationalStoreOptions;
        }
#pragma warning restore 8618

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            CustomizeAspNetIdentity(builder);
            CustomizeIdentityServer(builder);

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
                if (Database.IsNpgsql())
                {
                    entity.Property(e => e.CreatedAt)
                        .HasDefaultValueSql("timezone('utc', now())");
                }
            });

            builder.Entity<Blueprint>(entity =>
            {
                entity.HasAlternateKey(e => new { e.OwnerId, e.NormalizedSlug });

                entity.HasOne(e => e.LatestVersion!).WithMany()
                    .HasForeignKey(e => e.LatestVersionId)
                    .HasPrincipalKey(e => e.VersionId);

                entity.HasMany(e => e.Tags).WithOne()
                    .HasForeignKey(e => e.BlueprintId)
                    .HasPrincipalKey(e => e.BlueprintId);

                entity.Property(e => e.Icons)
                    .HasColumnType("jsonb");

                if (Database.IsNpgsql())
                {
                    entity.HasGeneratedTsVectorColumn(
                            e => e.SearchVector,
                            "english",
                            e => new { e.Title, e.Description, e.Slug })
                        .HasIndex(b => b.SearchVector)
                        .HasMethod("GIN");
                }
                else
                {
                    entity.Ignore(e => e.SearchVector);
                }
            });

            builder.Entity<BlueprintVersion>(entity =>
            {
                entity.HasAlternateKey(e => e.Hash);

                entity.HasOne(x => x.Blueprint!).WithMany()
                    .HasForeignKey(e => e.BlueprintId)
                    .HasPrincipalKey(e => e.BlueprintId);

                entity.Property(e => e.Hash)
                    .HasConversion(p => p.ToString(), p => Hash.Parse(p));

                entity.Property(e => e.GameVersion)
                    .HasConversion(p => p.ToString(4), p => Version.Parse(p));

                entity.HasOne(e => e.Payload!).WithMany()
                    .HasForeignKey(e => e.Hash)
                    .HasPrincipalKey(e => e.Hash);

                entity.Property(e => e.Icons)
                    .HasColumnType("jsonb");
            });

            builder.Entity<BlueprintPayload>(entity =>
            {
                entity.Property(e => e.Hash)
                    .HasConversion(p => p.ToString(), p => Hash.Parse(p));

                entity.Property(e => e.GameVersion)
                    .HasConversion(p => p.ToString(4), p => Version.Parse(p));
            });

            builder.Entity<Tag>(entity =>
            {
                entity.HasKey(e => new { e.BlueprintId, e.Value });
            });
        }

        private void CustomizeAspNetIdentity(ModelBuilder builder)
        {
            builder.Entity<User>().ToTable(nameof(Users), IdentitySchema);
            builder.Entity<Role>().ToTable(nameof(Roles), IdentitySchema);

            builder.Entity<IdentityRoleClaim<Guid>>().ToTable(nameof(RoleClaims), IdentitySchema);
            builder.Entity<IdentityUserClaim<Guid>>().ToTable(nameof(UserClaims), IdentitySchema);
            builder.Entity<IdentityUserLogin<Guid>>().ToTable(nameof(UserLogins), IdentitySchema);
            builder.Entity<IdentityUserRole<Guid>>().ToTable(nameof(UserRoles), IdentitySchema);
            builder.Entity<IdentityUserToken<Guid>>().ToTable(nameof(UserTokens), IdentitySchema);

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

                entity.HasData(new Role
                {
                    Id = Guid.Parse("52a39ea9-ab54-40ab-8ee0-98c069504f69"),
                    Name = "Moderator",
                    NormalizedName = "MODERATOR",
                });

                entity.HasData(new Role
                {
                    Id = Guid.Parse("3d15ca3a-584e-4d30-94df-b43d2303a4f4"),
                    Name = "Administrator",
                    NormalizedName = "ADMINISTRATOR",
                });
            });

            builder.Entity<IdentityUserLogin<Guid>>(entity =>
            {
                entity.Property(e => e.ProviderDisplayName).IsRequired();
            });
        }

        private void CustomizeIdentityServer(ModelBuilder builder)
        {
            builder.ConfigurePersistedGrantContext(_operationalStoreOptions.Value);

            builder.Entity<PersistedGrant>().ToTable(nameof(PersistedGrants), IdentitySchema);
            builder.Entity<DeviceFlowCodes>().ToTable(nameof(DeviceFlowCodes), IdentitySchema);
        }

        public Task<int> SaveChangesAsync() => base.SaveChangesAsync();
    }
}
