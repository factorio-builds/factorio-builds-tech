using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NodaTime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Core
{
    public class BlueprintService
    {
        public record CreateRequest(
            string Slug,
            string Title,
            string? Description,
            IEnumerable<string> Tags,
            (string? Name, string? Description) Version);

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

            public sealed record ParentNotFound(
                    Guid BlueprintId)
                : CreateResult { }

            public sealed record OwnerMismatch(
                    Guid BlueprintId,
                    string Slug,
                    (Guid Id, string UserName) Owner)
                : CreateResult { }

            private CreateResult() { }
        }

        private readonly ILogger<BlueprintService> _logger;
        private readonly AppDbContext _ctx;

        public BlueprintService(
            ILogger<BlueprintService> logger,
            AppDbContext ctx)
        {
            _logger = logger;
            _ctx = ctx;
        }

        public async Task<IReadOnlyCollection<Blueprint>> GetBlueprints(
            (int Current, int Size) page,
            (string Field, string Direction) sort,
            IReadOnlyCollection<string> tags,
            string? search,
            string? version)
        {
            var query = !tags.Any()
                ? _ctx.Blueprints.AsNoTracking()
                : _ctx.Tags.AsNoTracking()
                    .Where(t => tags.Contains(t.Value))
                    .Join(_ctx.Blueprints.AsNoTracking(),
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
                ("favorites", "asc") => query.OrderBy(x => x.FollowerCount).ThenBy(x => x.UpdatedAt),
                ("favorites", "desc") => query.OrderByDescending(x => x.FollowerCount).ThenBy(x => x.UpdatedAt),
                ("updated", "asc") => query.OrderBy(x => x.UpdatedAt),
                ("updated", "desc") => query.OrderByDescending(x => x.UpdatedAt),
                ("created", "asc") => query.OrderBy(x => x.CreatedAt),
                ("created", "desc") => query.OrderByDescending(x => x.CreatedAt),
                ("title", "asc") => query.OrderBy(x => x.Title),
                ("title", "desc") => query.OrderByDescending(x => x.Title),
                _ => throw new ArgumentOutOfRangeException(nameof(sort)),
            };

            return await query
                .Skip(Math.Max(page.Current - 1, 0) * page.Size).Take(page.Size)
                .ToListAsync();
        }

        public async Task<CreateResult> CreateOrAddVersion(
            CreateRequest request,
            BlueprintPayload payload,
            (Guid Id, string UserName) owner,
            Guid? parentId)
        {
            var dupe = await _ctx.BlueprintVersions.AsNoTracking()
                .Where(x => x.Hash == payload.Hash)
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
                    payload.Hash, dupe.VersionId, dupe.BlueprintId);

                return new CreateResult.DuplicateHash(dupe.VersionId, dupe.BlueprintId, dupe.Slug, (dupe.OwnerId, dupe.OwnerSlug));
            }

            var currentInstant = SystemClock.Instance.GetCurrentInstant();

            await using var tx = await _ctx.Database.BeginTransactionAsync();

            Blueprint? blueprint;

            if (parentId != null)
            {
                blueprint = await _ctx.Blueprints
                    .Include(bp => bp.Tags)
                    .FirstOrDefaultAsync(bp => bp.BlueprintId == parentId);

                if (blueprint == null)
                {
                    _logger.LogWarning("Attempted to add version to unknown blueprint: {BlueprintId}",
                        parentId);

                    return new CreateResult.ParentNotFound(parentId.Value);
                }

                if (blueprint.OwnerId != owner.Id)
                {
                    _logger.LogWarning("Attempted to add version to blueprint {BlueprintId} that is owned by {OwnerId}",
                        blueprint.BlueprintId, blueprint.OwnerId);

                    return new CreateResult.OwnerMismatch(blueprint.BlueprintId, blueprint.Slug, (blueprint.OwnerId, blueprint.OwnerSlug));
                }

                blueprint.UpdateDetails(
                    currentInstant,
                    request.Title.Trim(),
                    request.Description?.Trim(),
                    request.Tags.Where(Tags.All.Contains).Select(Tag.FromString).ToHashSet());
            }
            else
            {
                if (await SlugExistsForUser(owner.Id, request.Slug))
                {
                    _logger.LogWarning("Attempted to save blueprint with existing slug: {UserName}/{Slug}",
                        owner.UserName, request.Slug);

                    return new CreateResult.DuplicateSlug(request.Slug, owner);
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

                _ctx.Add(blueprint);
            }

            _ctx.Add(payload);

            var version = new BlueprintVersion(
                Guid.NewGuid(),
                blueprint.BlueprintId,
                currentInstant,
                payload.Hash,
                payload.GameVersion,
                request.Version.Name?.Trim(),
                request.Version.Description?.Trim());

            _ctx.Add(version);

            await _ctx.SaveChangesAsync();

            blueprint.UpdateLatestVersion(version);

            await _ctx.SaveChangesAsync();
            await tx.CommitAsync();

            return new CreateResult.Success(blueprint);
        }

        public async Task<bool> SlugExistsForUser(Guid userId, string slug) =>
            await _ctx.Blueprints.AnyAsync(bp => bp.Slug == slug && bp.OwnerId == userId);
    }
}
