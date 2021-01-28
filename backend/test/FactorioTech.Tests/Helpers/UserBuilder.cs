using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using NodaTime;
using System;
using System.Threading.Tasks;

namespace FactorioTech.Tests.Helpers
{
    public class UserBuilder
    {
        private Guid _userId;

        public async Task<User> Save(AppDbContext dbContext, bool clearCache = true)
        {
            _userId = Guid.NewGuid();
            var user = new User
            {
                Id = _userId,
                Email = $"test-{_userId}@factorio.tech",
                NormalizedEmail = $"test-{_userId}@factorio.tech".ToUpperInvariant(),
                UserName = $"test-{_userId}",
                NormalizedUserName = $"test-{_userId}".ToUpperInvariant(),
                DisplayName = $"Test: {_userId}",
                RegisteredAt = SystemClock.Instance.GetCurrentInstant(),
            };

            dbContext.Add(user);
            await dbContext.SaveChangesAsync();

            if (clearCache)
            {
                dbContext.ClearCache();
            }

            return user;
        }
    }
}
