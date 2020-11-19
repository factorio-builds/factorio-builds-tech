using FactorioTech.Web.Core.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace FactorioTech.Web.Data
{
    public class AppDbContext : IdentityDbContext<User, Role, Guid>
    {

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
        }

        private void CustomizeAspNetIdentity(ModelBuilder builder)
        {
            builder.Entity<User>(entity =>
            {
                entity.Property(e => e.UserName).IsRequired();
                entity.Property(e => e.NormalizedUserName).IsRequired();
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
