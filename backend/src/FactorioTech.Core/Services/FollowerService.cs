using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NodaTime;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FactorioTech.Core.Services
{
    public class FollowerService
    {
        private readonly ILogger<FollowerService> _logger;
        private readonly AppDbContext _dbContext;

        public FollowerService(
            ILogger<FollowerService> logger,
            AppDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        public async Task<IReadOnlyCollection<User>?> Get(string owner, string slug)
        {
            var buildId = await TryFindBuildId(owner, slug);
            if (buildId == Guid.Empty)
                return null;

            return await _dbContext.Favorites.AsNoTracking()
                .Where(f => f.BlueprintId == buildId)
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

            var existing = await _dbContext.Favorites.AsNoTracking()
                .FirstOrDefaultAsync(f => f.BlueprintId == buildId && f.UserId == userId);

            if (existing != null)
                return false;

            try
            {
                _dbContext.Add(new Favorite
                {
                    BlueprintId = buildId,
                    UserId = userId,
                    CreatedAt = SystemClock.Instance.GetCurrentInstant(),
                });

                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateException ex) when ((ex.InnerException as PostgresException)?.SqlState == PostgresErrorCodes.UniqueViolation)
            {
                // swallow unique key violations
                _logger.LogWarning("Tried to add existing follower {UserId} to build {BuildId}", userId, buildId);
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

            var existing = await _dbContext.Favorites
                .FirstOrDefaultAsync(f => f.BlueprintId == buildId && f.UserId == userId);

            if (existing == null)
                return false;

            try
            {
                _dbContext.Remove(existing);
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // swallow concurrency exception
                _logger.LogWarning("Tried to remove follower {UserId} from build {BuildId}", userId, buildId);
                return false;
            }

            return true;
        }

        private async Task<Guid> TryFindBuildId(string owner, string slug) =>
            await _dbContext.Blueprints.AsNoTracking()
                .Where(b => b.NormalizedOwnerSlug == owner.ToUpperInvariant()
                         && b.NormalizedSlug == slug.ToUpperInvariant())
                .Select(b => b.BlueprintId)
                .FirstOrDefaultAsync();
    }
}
