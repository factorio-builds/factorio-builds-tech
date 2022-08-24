using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using NodaTime;

namespace FactorioTech.Tests.Helpers;

public class UserBuilder
{
    private Guid userId;

    public async Task<User> Save(AppDbContext dbContext, bool clearCache = true)
    {
        userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            Email = $"test-{userId}@factorio.tech",
            NormalizedEmail = $"test-{userId}@factorio.tech".ToUpperInvariant(),
            UserName = $"test-{userId}",
            NormalizedUserName = $"test-{userId}".ToUpperInvariant(),
            DisplayName = $"Test: {userId}",
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
