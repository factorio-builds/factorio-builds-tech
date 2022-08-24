using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NodaTime;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace FactorioTech.Core.Services;

[AutoConstructor]
public partial class BuildService
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

    public record EditRequest(
        string Owner,
        string Slug,
        string? Title,
        string? Description,
        IEnumerable<string>? Tags);

    public record CreateRequest(
        string Owner,
        string Slug,
        string Title,
        string? Description,
        IEnumerable<string> Tags,
        (Hash Hash, string? Name, string? Description, IEnumerable<GameIcon> Icons) Version,
        Guid? ExpectedVersionId);

    public record EditResult
    {
        public sealed record Success(
                Build Build)
            : EditResult { }

        public sealed record BuildNotFound(
                string Owner,
                string Slug)
            : EditResult { }

        public sealed record NotAuthorized(
                Guid UserId)
            : EditResult { }

        private EditResult() { }
    }

    public record DeleteResult
    {
        public sealed record Success
            : DeleteResult { }

        public sealed record BuildNotFound(
                string Owner,
                string Slug)
            : DeleteResult { }

        public sealed record NotAuthorized(
                Guid UserId)
            : DeleteResult { }

        private DeleteResult() { }
    }

    public record CreateResult
    {
        public sealed record Success(
                Build Build)
            : CreateResult { }

        public sealed record BuildNotFound(
                string Owner,
                string Slug)
            : CreateResult { }

        public sealed record NotAuthorized(
                Guid UserId)
            : CreateResult { }

        public sealed record DuplicateHash(
                Guid VersionId,
                Guid BlueprintId,
                string Slug,
                Guid OwnerId,
                string OwnerSlug)
            : CreateResult { }

        public sealed record DuplicateSlug(
                string Owner,
                string Slug)
            : CreateResult { }

        public sealed record UnexpectedParentVersion(
                Guid BlueprintId, Guid ExpectedLatestVersionId, Guid ActualLatestVersionId)
            : CreateResult { }

        public sealed record PayloadNotFound(
                Hash Hash)
            : CreateResult { }

        private CreateResult() { }
    }

    private readonly ILogger<BuildService> logger;
    private readonly AppDbContext dbContext;
    private readonly BuildTags buildTags;

    public async Task<(IReadOnlyCollection<Build> Builds, bool HasMore, int TotalCount)> GetBuilds(
        (int Current, int Size) page,
        (SortField Field, SortDirection Direction) sort,
        string[] tags,
        string? search,
        string? version,
        string? owner)
    {
        var query = dbContext.Builds.AsNoTracking();

        if (tags.Any())
        {
            // note: do not convert the Contains call to method group! the lambda is required for EF translation
            // ReSharper disable once ConvertClosureToMethodGroup
            query = query.Where(x => x.Tags.Any(t => tags.Contains(t)));
        }

        if (!string.IsNullOrEmpty(version))
        {
            query = query.Where(x => x.LatestGameVersion.StartsWith(version));
        }

        if (!string.IsNullOrEmpty(owner))
        {
            query = query.Where(x => x.NormalizedOwnerSlug == owner.ToUpperInvariant());
        }

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(x => x.SearchVector!.Matches(EF.Functions.ToTsQuery("english", BuildSearchQuery(search))));
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
            .Skip(Math.Max(page.Current - 1, 0) * page.Size).Take(page.Size + 1)
            .ToListAsync();

        var blueprints = results.GetRange(0, Math.Min(results.Count, page.Size));
        var totalCount = await dbContext.Builds.CountAsync();

        return (blueprints, results.Count > page.Size, totalCount);
    }

    private static string BuildSearchQuery(string input)
    {
        // note: we're not using `websearch_to_tsquery` (or similar)
        // because we want to get prefix matching.
        var words = Regex.Replace(input, "[:|&+!*<>'\\-\"\\.]", string.Empty)
            .Split(" ")
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Select(x => $"{x}:*");

        return string.Join(" | ", words);
    }

    public async Task<(Build? Build, bool IsFollower)> GetDetails(string owner, string slug, ClaimsPrincipal principal)
    {
        var build = await dbContext.Builds.AsNoTracking()
            .Where(b => b.NormalizedOwnerSlug == owner.ToUpperInvariant()
                        && b.NormalizedSlug == slug.ToUpperInvariant())
            .Include(b => b.Owner)
            .Include(b => b.LatestVersion!).ThenInclude(v => v.Payload)
            .FirstOrDefaultAsync();

        if (build?.LatestVersion?.Payload == null)
            return (null, false);

        var currentUserId = principal.TryGetUserId();
        var currentUserIsFollower = currentUserId != null && await dbContext.Favorites.AsNoTracking()
            .AnyAsync(f => f.BuildId == build.BuildId && f.UserId == currentUserId);

        return (build, currentUserIsFollower);
    }

    public async Task<CreateResult> CreateOrAddVersion(CreateRequest request, ITempCoverHandle cover, ClaimsPrincipal principal)
    {
        var dupe = await dbContext.Versions.AsNoTracking()
            .Where(v => v.Hash == request.Version.Hash)
            .Select(v => new
            {
                v.VersionId,
                BlueprintId = v.BuildId,
                v.Build!.Slug,
                v.Build!.OwnerId,
                v.Build!.OwnerSlug,
            })
            .FirstOrDefaultAsync();

        if (dupe != null)
        {
            logger.LogWarning("Attempted to save duplicate payload with hash {Hash}. The hash already exists in {VersionId} of blueprint {BlueprintId}",
                request.Version.Hash, dupe.VersionId, dupe.BlueprintId);
            return new CreateResult.DuplicateHash(dupe.VersionId, dupe.BlueprintId, dupe.Slug, dupe.OwnerId, dupe.OwnerSlug);
        }

        var payload = await dbContext.Payloads.FirstOrDefaultAsync(x => x.Hash == request.Version.Hash);
        if (payload == null)
        {
            logger.LogWarning("Attempted to save blueprint version with unknown payload: {Hash}", request.Version.Hash);
            return new CreateResult.PayloadNotFound(request.Version.Hash);
        }

        await using var tx = await dbContext.Database.BeginTransactionAsync();

        var existing = await dbContext.Builds
            .Where(b => b.NormalizedOwnerSlug == request.Owner.ToUpperInvariant()
                        && b.NormalizedSlug == request.Slug.ToUpperInvariant())
            .FirstOrDefaultAsync();

        var result = request.ExpectedVersionId.HasValue
            ? TryUpdate(request, cover.Meta, principal, existing)
            : await TryCreate(request, cover.Meta, principal, existing);

        var success = result as CreateResult.Success;
        if (success == null)
            return result;

        var version = new BuildVersion(
            Guid.NewGuid(),
            success.Build.BuildId,
            success.Build.UpdatedAt,
            payload.Hash,
            payload.Type,
            payload.GameVersion,
            request.Version.Name?.Trim(),
            request.Version.Description?.Trim(),
            request.Version.Icons);

        dbContext.Add(version);

        await dbContext.SaveChangesAsync();

        success.Build.UpdateLatestVersion(version);

        await dbContext.SaveChangesAsync();
        await tx.CommitAsync();

        await cover.Assign(success.Build.BuildId, existing?.CoverMeta);

        return result;
    }

    public async Task<EditResult> Edit(EditRequest request, ITempCoverHandle? cover, ClaimsPrincipal principal)
    {
        var build = await dbContext.Builds
            .Where(b => b.NormalizedOwnerSlug == request.Owner.ToUpperInvariant()
                        && b.NormalizedSlug == request.Slug.ToUpperInvariant())
            .FirstOrDefaultAsync();

        if (build == null)
            return new EditResult.BuildNotFound(request.Owner, request.Slug);

        if (!principal.CanEdit(build))
            return new EditResult.NotAuthorized(principal.GetUserId());

        var existingCover = build.CoverMeta;

        build.UpdateDetails(
            SystemClock.Instance.GetCurrentInstant(),
            request.Title,
            request.Description,
            request.Tags?.Where(buildTags.Contains),
            cover?.Meta);

        await dbContext.SaveChangesAsync();

        cover?.Assign(build.BuildId, existingCover);

        return new EditResult.Success(build);
    }

    public async Task<DeleteResult> Delete(string owner, string slug, ClaimsPrincipal principal)
    {
        var build = await dbContext.Builds
            .Where(b => b.NormalizedOwnerSlug == owner.ToUpperInvariant()
                        && b.NormalizedSlug == slug.ToUpperInvariant())
            .FirstOrDefaultAsync();

        if (build == null)
            return new DeleteResult.BuildNotFound(owner, slug);

        if (!principal.CanDelete(build))
            return new DeleteResult.NotAuthorized(principal.GetUserId());

        var versions = await dbContext.Versions
            .Where(v => v.BuildId == build.BuildId)
            .ToListAsync();

        dbContext.Remove(build);
        dbContext.RemoveRange(versions);

        await dbContext.SaveChangesAsync();

        return new DeleteResult.Success();
    }

    public async Task SavePayloadGraph(Hash parentHash, IReadOnlyCollection<Payload> payloads)
    {
        var newHashes = payloads.Select(p => p.Hash);
        var existingHashes = await dbContext.Payloads.AsNoTracking()
            .Where(x => newHashes.Contains(x.Hash))
            .Select(x => x.Hash)
            .ToListAsync();

        var newPayloads = payloads.Where(p => !existingHashes.Contains(p.Hash)).Distinct(Payload.EqualityComparer).ToList();

        logger.LogInformation("Persisting the full payload graph for blueprint {Hash}: {Total} total, {Existing} existing, {Added} to be added",
            parentHash, payloads.Count, existingHashes.Count, newPayloads.Count);

        // todo: ideally this would be implemented using INSERT .. ON CONFLICT DO NOTHING, but ef core
        // doesn't seem to support that. the current implementation with SELECT + INSERT is obviously slower;
        // but more importantly there's a race condition that can lead to conflicts.
        // ReSharper disable once MethodHasAsyncOverload
        dbContext.AddRange(newPayloads);

        await dbContext.SaveChangesAsync();
    }

    private CreateResult TryUpdate(CreateRequest request, ImageMeta coverMeta, ClaimsPrincipal principal, Build? existing)
    {
        if (existing == null)
        {
            logger.LogWarning("Attempted to add version to unknown blueprint {Slug}", request.Slug);
            return new CreateResult.BuildNotFound(request.Owner, request.Slug);
        }

        if (!principal.CanAddVersion(existing))
        {
            logger.LogWarning("Attempted to add version, but user {UserId} is not authorized", principal.GetUserId());
            return new CreateResult.NotAuthorized(principal.GetUserId());
        }

        if (existing.LatestVersionId != request.ExpectedVersionId)
        {
            logger.LogWarning("Attempted to add version to blueprint {BlueprintId} but expected latest version id {ExpectedVersionId} does not match actual {LatestVersionId}",
                existing.BuildId, request.ExpectedVersionId, existing.LatestVersionId);
            return new CreateResult.UnexpectedParentVersion(
                existing.BuildId,
                request.ExpectedVersionId.GetValueOrDefault(),
                existing.LatestVersionId.GetValueOrDefault());
        }

        existing.UpdateDetails(
            SystemClock.Instance.GetCurrentInstant(),
            request.Title,
            request.Description,
            request.Tags.Where(buildTags.Contains),
            coverMeta);

        return new CreateResult.Success(existing);
    }

    private async Task<CreateResult> TryCreate(CreateRequest request, ImageMeta coverMeta, ClaimsPrincipal principal, Build? existing)
    {
        if (existing != null)
        {
            logger.LogWarning("Attempted to save blueprint with existing slug {Slug}", request.Slug);
            return new CreateResult.DuplicateSlug(request.Owner, request.Slug);
        }

        var owner = await dbContext.Users.FindAsync(principal.GetUserId());
        if (owner == null)
            throw new InvalidOperationException($"Invalid user id: {principal.GetUserId()}");

        var currentInstant = SystemClock.Instance.GetCurrentInstant();
        var build = new Build(
            Guid.NewGuid(),
            owner,
            currentInstant,
            currentInstant,
            request.Slug,
            request.Tags.Where(buildTags.Contains),
            request.Title.Trim(),
            request.Description?.Trim(),
            coverMeta);

        dbContext.Add(build);

        return new CreateResult.Success(build);
    }
}
