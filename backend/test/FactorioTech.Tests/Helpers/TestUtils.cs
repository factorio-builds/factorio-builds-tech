using FactorioTech.Core.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;

namespace FactorioTech.Tests.Helpers
{
    public static class TestUtils
    {
        public static Lazy<BuildTags> Tags = new(BuildTags.Load);

        public static DbContext ClearCache(this DbContext db)
        {
            foreach (var entry in db.ChangeTracker.Entries())
            {
                db.Entry(entry.Entity).State = EntityState.Detached;
            }

            return db;
        }

        public static ClaimsPrincipal ToClaimsPrincipal(this User user) =>
            new(new ClaimsIdentity(new Claim[]
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new("username", user.UserName),
            }));
    }
}
