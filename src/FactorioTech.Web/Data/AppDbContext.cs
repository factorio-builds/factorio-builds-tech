using FactorioTech.Web.Core.Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace FactorioTech.Web.Data
{
    public class AppDbContext : IdentityDbContext<User, Role, Guid>
    {
        public DbSet<Blueprint> Blueprints { get; set; }

#pragma warning disable 8618
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
#pragma warning restore 8618
    }
}
