using Duende.IdentityServer.EntityFramework.Entities;
using Duende.IdentityServer.EntityFramework.Extensions;
using Duende.IdentityServer.EntityFramework.Interfaces;
using Duende.IdentityServer.EntityFramework.Options;
using FactorioTech.Core.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace FactorioTech.Core.Data
{
    public class PersistedGrantIdentityContext : IdentityDbContext<User, Role, Guid>, IPersistedGrantDbContext
    {
        public DbSet<PersistedGrant> PersistedGrants { get; set; }
        public DbSet<DeviceFlowCodes> DeviceFlowCodes { get; set; }
        public DbSet<Key> Keys { get; set; }

        private const string IdentitySchema = "identity";
        private readonly IOptions<OperationalStoreOptions> _operationalStoreOptions;

#pragma warning disable 8618
        public PersistedGrantIdentityContext(DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options)
        {
            _operationalStoreOptions = operationalStoreOptions;
        }
#pragma warning restore 8618

        public Task<int> SaveChangesAsync() => base.SaveChangesAsync();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            CustomizeAspNetIdentity(builder);
            CustomizeIdentityServer(builder);
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
            builder.Entity<Key>().ToTable(nameof(Keys), IdentitySchema);
        }
    }
}
