using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NodaTime;
using Npgsql;
using System.Security.Claims;

namespace FactorioTech.Core.Services;

[AutoConstructor]
public partial class FollowerService
{
    private readonly ILogger<FollowerService> logger;
    private readonly AppDbContext dbContext;

    public async Task<IReadOnlyCollection<User>?> Get(string owner, string slug)
    {
        var buildId = await TryFindBuildId(owner, slug);
        if (buildId == Guid.Empty)
            return null;

        return await dbContext.Favorites.AsNoTracking()
            .Where(f => f.BuildId == buildId)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => f.User!)
            .Distinct()
            .ToListAsync();
    }

    public async Task<bool?> Follow(string owner, string slug, ClaimsPrincipal principal)
    {
        var buildId = await TryFindBuildId(owner, slug);
        if (buildId == Guid.Empty)
            return null;

        var userId = principal.GetUserId();

        // todo: this is obviously a race condition!
        // instead of selecting and handling potential conflicts, this should be an upsert.
        // ef core doesn't currently support that and I'm too lazy to write proper raw sql.

        var existing = await dbContext.Favorites.AsNoTracking()
            .FirstOrDefaultAsync(f => f.BuildId == buildId && f.UserId == userId);

        if (existing != null)
            return false;

        try
        {
            dbContext.Add(new Favorite
            {
                BuildId = buildId,
                UserId = userId,
                CreatedAt = SystemClock.Instance.GetCurrentInstant(),
            });

            await dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when ((ex.InnerException as PostgresException)?.SqlState == PostgresErrorCodes.UniqueViolation)
        {
            // swallow unique key violations
            logger.LogWarning("Tried to add existing follower {UserId} to build {BuildId}", userId, buildId);
            return false;
        }

        return true;
    }

    public async Task<bool?> Unfollow(string owner, string slug, ClaimsPrincipal principal)
    {
        var buildId = await TryFindBuildId(owner, slug);
        if (buildId == Guid.Empty)
            return null;

        var userId = principal.GetUserId();

        // todo: this is obviously a race condition!

        var existing = await dbContext.Favorites
            .FirstOrDefaultAsync(f => f.BuildId == buildId && f.UserId == userId);

        if (existing == null)
            return false;

        try
        {
            dbContext.Remove(existing);
            await dbContext.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            // swallow concurrency exception
            logger.LogWarning("Tried to remove follower {UserId} from build {BuildId}", userId, buildId);
            return false;
        }

        return true;
    }

    private async Task<Guid> TryFindBuildId(string owner, string slug) =>
        await dbContext.Builds.AsNoTracking()
            .Where(b => b.NormalizedOwnerSlug == owner.ToUpperInvariant()
                        && b.NormalizedSlug == slug.ToUpperInvariant())
            .Select(b => b.BuildId)
            .FirstOrDefaultAsync();
}
