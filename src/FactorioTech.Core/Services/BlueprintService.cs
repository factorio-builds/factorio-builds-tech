using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NodaTime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Core.Services
{
    public class BlueprintService
    {
        public enum SortField
        {
            Title,
            Created,
            Updated,
            Favorites,
        }

        public enum SortDirection
        {
            Asc,
            Desc,
        }

        public record CreateRequest(
            string Slug,
            string Title,
            string? Description,
            IEnumerable<string> Tags,
            (Hash Hash, string? Name, string? Description, IEnumerable<GameIcon> Icons) Version,
            (Guid? BlueprintId, Guid? ExpectedVersionId) Parent);

        public record CreateResult
        {
            public sealed record Success(
                Blueprint Blueprint)
                : CreateResult { }

            public sealed record DuplicateHash(
                Guid VersionId,
                Guid BlueprintId,
                string Slug,
                (Guid Id, string UserName) Owner)
                : CreateResult { }

            public sealed record DuplicateSlug(
                    string Slug,
                    (Guid Id, string UserName) Owner)
                : CreateResult { }

            public sealed record InvalidSlug(
                    string Slug)
                : CreateResult { }

            public sealed record ParentNotFound(
                    Guid BlueprintId)
                : CreateResult { }

            public sealed record UnexpectedParentVersion(
                    Guid BlueprintId, Guid ExpectedLatestVersionId, Guid ActualLatestVersionId)
                : CreateResult { }

            public sealed record PayloadNotFound(
                    Hash Hash)
                : CreateResult { }

            public sealed record OwnerMismatch(
                    Guid BlueprintId,
                    string Slug,
                    (Guid Id, string UserName) Owner)
                : CreateResult { }

            private CreateResult() { }
        }

        private readonly ILogger<BlueprintService> _logger;
        private readonly AppDbContext _dbContext;

        public BlueprintService(
            ILogger<BlueprintService> logger,
            AppDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        public async Task<(IReadOnlyCollection<Blueprint> Blueprints, bool HasMore, int TotalCount)> GetBlueprints(
            (int Current, int Size) page,
            (SortField Field, SortDirection Direction) sort,
            IReadOnlyCollection<string> tags,
            string? search,
            string? version)
        {
            var query = !tags.Any()
                ? _dbContext.Blueprints.AsNoTracking()
                : _dbContext.Tags.AsNoTracking()
                    .Where(t => tags.Contains(t.Value))
                    .Join(_dbContext.Blueprints.AsNoTracking(),
                        t => t.BlueprintId,
                        bp => bp.BlueprintId,
                        (t, bp) => bp)
                    .Distinct();

            if (!string.IsNullOrEmpty(version))
            {
                query = query.Where(x => x.LatestGameVersion.StartsWith(version));
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(x => x.SearchVector!.Matches(EF.Functions.WebSearchToTsQuery("english", search)));
            }

            query = sort switch
            {
                (SortField.Favorites, SortDirection.Asc) => query.OrderBy(x => x.FollowerCount).ThenBy(x => x.UpdatedAt),
                (SortField.Favorites, SortDirection.Desc) => query.OrderByDescending(x => x.FollowerCount).ThenBy(x => x.UpdatedAt),
                (SortField.Updated, SortDirection.Asc) => query.OrderBy(x => x.UpdatedAt),
                (SortField.Updated, SortDirection.Desc) => query.OrderByDescending(x => x.UpdatedAt),
                (SortField.Created, SortDirection.Asc) => query.OrderBy(x => x.CreatedAt),
                (SortField.Created, SortDirection.Desc) => query.OrderByDescending(x => x.CreatedAt),
                (SortField.Title, SortDirection.Asc) => query.OrderBy(x => x.Title),
                (SortField.Title, SortDirection.Desc) => query.OrderByDescending(x => x.Title),
                _ => throw new ArgumentOutOfRangeException(nameof(sort)),
            };

            var results = await query
                .Include(bp => bp.Tags)
                .Skip(Math.Max(page.Current - 1, 0) * page.Size).Take(page.Size + 1)
                .ToListAsync();

            var totalCount = await _dbContext.Blueprints.CountAsync();

            return (results, results.Count > page.Size, totalCount);
        }

        public async Task<Blueprint?> GetBlueprint(string owner, string slug)
        {
            var blueprint = await _dbContext.Blueprints.AsNoTracking()
                .Where(bp => bp.NormalizedOwnerSlug == owner.ToUpperInvariant()
                          && bp.NormalizedSlug == slug.ToUpperInvariant())
                .Include(bp => bp.Owner)
                .Include(bp => bp.Tags)
                .Include(bp => bp.LatestVersion!).ThenInclude(v => v.Payload)
                .FirstOrDefaultAsync();

            return blueprint;
        }

        public async Task<CreateResult> CreateOrAddVersion(CreateRequest request, Guid ownerId)
        {
            if (AppConfig.Policies.Slug.Blocklist.Contains(request.Slug.ToLowerInvariant()))
                return new CreateResult.InvalidSlug(request.Slug);

            var dupe = await _dbContext.BlueprintVersions.AsNoTracking()
                .Where(x => x.Hash == request.Version.Hash)
                .Select(x => new
                {
                    x.VersionId,
                    x.BlueprintId,
                    x.Blueprint!.Slug,
                    x.Blueprint!.OwnerId,
                    x.Blueprint!.OwnerSlug,
                })
                .FirstOrDefaultAsync();

            if (dupe != null)
            {
                _logger.LogWarning("Attempted to save duplicate payload with hash {Hash}. The hash already exists in {VersionId} of blueprint {BlueprintId}",
                    request.Version.Hash, dupe.VersionId, dupe.BlueprintId);
                return new CreateResult.DuplicateHash(dupe.VersionId, dupe.BlueprintId, dupe.Slug, (dupe.OwnerId, dupe.OwnerSlug));
            }

            var payload = await _dbContext.BlueprintPayloads.FirstOrDefaultAsync(x => x.Hash == request.Version.Hash);
            if (payload == null)
            {
                _logger.LogWarning("Attempted to save blueprint version with unknown payload: {Hash}", request.Version.Hash);
                return new CreateResult.PayloadNotFound(request.Version.Hash);
            }

            var currentInstant = SystemClock.Instance.GetCurrentInstant();

            await using var tx = await _dbContext.Database.BeginTransactionAsync();

            Blueprint? blueprint;

            if (request.Parent.BlueprintId.HasValue)
            {
                blueprint = await _dbContext.Blueprints
                    .Include(bp => bp.Tags)
                    .FirstOrDefaultAsync(bp => bp.BlueprintId == request.Parent.BlueprintId);

                if (blueprint == null)
                {
                    _logger.LogWarning("Attempted to add version to unknown blueprint: {BlueprintId}", request.Parent.BlueprintId);
                    return new CreateResult.ParentNotFound(request.Parent.BlueprintId.Value);
                }

                if (blueprint.OwnerId != ownerId)
                {
                    _logger.LogWarning("Attempted to add version to blueprint {BlueprintId} that is owned by {OwnerId}",
                        blueprint.BlueprintId, blueprint.OwnerId);
                    return new CreateResult.OwnerMismatch(blueprint.BlueprintId, blueprint.Slug, (blueprint.OwnerId, blueprint.OwnerSlug));
                }

                if (blueprint.LatestVersionId != request.Parent.ExpectedVersionId)
                {
                    _logger.LogWarning("Attempted to add version to blueprint {BlueprintId} but expected latest version id {ExpectedVersionId} does not match actual {LatestVersionId}",
                        blueprint.BlueprintId, request.Parent.ExpectedVersionId, blueprint.LatestVersionId);
                    return new CreateResult.UnexpectedParentVersion(
                        blueprint.BlueprintId,
                        request.Parent.ExpectedVersionId.GetValueOrDefault(),
                        blueprint.LatestVersionId.GetValueOrDefault());
                }

                blueprint.UpdateDetails(
                    currentInstant,
                    request.Title.Trim(),
                    request.Description?.Trim(),
                    request.Tags.Where(Tags.All.Contains).Select(Tag.FromString).ToHashSet());
            }
            else
            {
                var owner = await _dbContext.Users.FindAsync(ownerId);

                if (await SlugExistsForUser(ownerId, request.Slug))
                {
                    _logger.LogWarning("Attempted to save blueprint with existing slug: {UserName}/{Slug}",
                        owner.UserName, request.Slug);
                    return new CreateResult.DuplicateSlug(request.Slug, (owner.Id, owner.UserName));
                }

                blueprint = new Blueprint(
                    Guid.NewGuid(),
                    owner,
                    currentInstant,
                    currentInstant,
                    request.Slug,
                    request.Tags.Where(Tags.All.Contains).Select(Tag.FromString),
                    request.Title.Trim(),
                    request.Description?.Trim());

                _dbContext.Add(blueprint);
            }

            var version = new BlueprintVersion(
                Guid.NewGuid(),
                blueprint.BlueprintId,
                currentInstant,
                payload.Hash,
                payload.GameVersion,
                request.Version.Name?.Trim(),
                request.Version.Description?.Trim(),
                request.Version.Icons);

            _dbContext.Add(version);

            await _dbContext.SaveChangesAsync();

            blueprint.UpdateLatestVersion(version);

            await _dbContext.SaveChangesAsync();
            await tx.CommitAsync();

            return new CreateResult.Success(blueprint);
        }

        public async Task<bool> SlugExistsForUser(Guid userId, string slug) =>
            await _dbContext.Blueprints.AnyAsync(bp => bp.NormalizedSlug == slug.ToUpperInvariant() && bp.OwnerId == userId);

        public async Task SavePayloadGraph(Hash parentHash, IReadOnlyCollection<BlueprintPayload> payloads)
        {
            var newHashes = payloads.Select(p => p.Hash);
            var existingHashes = await _dbContext.BlueprintPayloads.AsNoTracking()
                .Where(x => newHashes.Contains(x.Hash))
                .Select(x => x.Hash)
                .ToListAsync();

            var newPayloads = payloads.Where(p => !existingHashes.Contains(p.Hash)).Distinct(BlueprintPayload.EqualityComparer).ToList();

            _logger.LogInformation("Persisting the full payload graph for blueprint {Hash}: {Total} total, {Existing} existing, {Added} to be added",
                parentHash, payloads.Count, existingHashes.Count, newPayloads.Count);

            // todo: ideally this would be implemented using INSERT .. ON CONFLICT DO NOTHING, but ef core
            // doesn't seem to support that. the current implementation with SELECT + INSERT is obviously slower;
            // but more importantly there's a race condition that can lead to conflicts.
            // ReSharper disable once MethodHasAsyncOverload
            _dbContext.AddRange(newPayloads);

            await _dbContext.SaveChangesAsync();
        }
    }
}
