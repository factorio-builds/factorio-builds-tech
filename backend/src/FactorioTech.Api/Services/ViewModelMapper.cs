using FactorioTech.Api.ViewModels;
using FactorioTech.Core;
using FactorioTech.Core.Domain;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace FactorioTech.Api.Services
{
    public static class ViewModelMapper
    {
        public static UsersModel ToViewModel(this IReadOnlyCollection<User> users) =>
            new()
            {
                Users = users.Select(ToViewModel),
                Count = users.Count,
            };

        public static FullUserModel ToViewModel(this User user) =>
            new()
            {
                Username = user.UserName,
                DisplayName = user.DisplayName,
                RegisteredAt = user.RegisteredAt,
            };

        public static BuildsModel ToViewModel(this IReadOnlyCollection<Blueprint> blueprints,
            IUrlHelper urlHelper, BuildsQueryParams query, bool hasMore, int totalCount) =>
            new()
            {
                Links = urlHelper.BuildLinks(blueprints, query, hasMore),
                Builds = blueprints.Take(BuildsQueryParams.PageSize).Select(b => b.ToThinViewModel(urlHelper)),
                CurrentCount = Math.Min(blueprints.Count, BuildsQueryParams.PageSize),
                TotalCount = totalCount,
            };

        public static ThinBuildModel ToThinViewModel(this Blueprint blueprint, IUrlHelper urlHelper) =>
            new()
            {
                Links = urlHelper.BuildThinLinks(blueprint),
                Slug = blueprint.Slug,
                CreatedAt = blueprint.CreatedAt,
                UpdatedAt = blueprint.UpdatedAt,
                Icons = blueprint.Icons,
                Title = blueprint.Title,
                Description = blueprint.Description,
                Owner = blueprint.Owner?.ToViewModel() ?? new ThinUserModel { Username = blueprint.OwnerSlug },
                LatestType = blueprint.LatestType,
                LatestGameVersion = Version.Parse(blueprint.LatestGameVersion),
                Tags = blueprint.Tags?.Select(t => t.Value) ?? throw new ArgumentNullException(nameof(blueprint.Tags)),
            };

        public static FullBuildModel ToFullViewModel(this Blueprint blueprint, IUrlHelper urlHelper, FactorioApi.BlueprintEnvelope envelope, bool currentUserIsFollower) =>
            new()
            {
                Links = urlHelper.BuildFullLinks(blueprint, currentUserIsFollower),
                Slug = blueprint.Slug,
                CreatedAt = blueprint.CreatedAt,
                UpdatedAt = blueprint.UpdatedAt,
                Icons = blueprint.Icons,
                Title = blueprint.Title,
                Description = blueprint.Description,
                LatestType = blueprint.LatestType,
                LatestGameVersion = Version.Parse(blueprint.LatestGameVersion),
                LatestVersion = blueprint.LatestVersion?.ToFullViewModel(urlHelper, envelope) ?? throw new ArgumentNullException(nameof(blueprint.LatestVersion)),
                Owner = blueprint.Owner?.ToViewModel() ?? throw new ArgumentNullException(nameof(blueprint.Owner)),
                Tags = blueprint.Tags?.Select(t => t.Value) ?? throw new ArgumentNullException(nameof(blueprint.Tags)),
            };

        public static VersionsModel ToViewModel(this IReadOnlyCollection<BlueprintVersion> versions, IUrlHelper urlHelper) =>
            new()
            {
                Count = versions.Count,
                Versions = versions.Select(v => v.ToThinViewModel(urlHelper)),
            };

        public static ThinVersionModel ToThinViewModel(this BlueprintVersion version, IUrlHelper urlHelper) =>
            new()
            {
                Links = urlHelper.BuildLinks(version),
                Hash = version.Hash,
                Type = version.Type,
                CreatedAt = version.CreatedAt,
                Name = version.Name,
                Description = version.Description,
            };

        public static FullVersionModel ToFullViewModel(this BlueprintVersion version, IUrlHelper urlHelper, FactorioApi.BlueprintEnvelope envelope) =>
            new()
            {
                Links = urlHelper.BuildLinks(version),
                Hash = version.Hash,
                Type = version.Type,
                CreatedAt = version.CreatedAt,
                Name = version.Name,
                Description = version.Description,
                Payload = version.Payload?.ToViewModel(urlHelper, envelope)
                          ?? throw new ArgumentNullException(nameof(version.Payload)),
            };

        public static PayloadModelBase ToViewModel(this BlueprintPayload payload, IUrlHelper urlHelper, FactorioApi.BlueprintEnvelope envelope, PayloadCache? payloadGraph = null) =>
            payload.Type switch
            {
                BlueprintType.Blueprint => payload.ToBlueprintViewModel(urlHelper, envelope),
                BlueprintType.Book => payload.ToBookViewModel(urlHelper, envelope, payloadGraph),
                _ => throw new ArgumentOutOfRangeException(nameof(payload.Type)),
            };

        public static BlueprintPayloadModel ToBlueprintViewModel(this BlueprintPayload payload, IUrlHelper urlHelper, FactorioApi.BlueprintEnvelope envelope) =>
            new()
            {
                Links = urlHelper.BuildLinks(payload, envelope),
                Hash = payload.Hash,
                Type = payload.Type,
                GameVersion = payload.GameVersion,
                Encoded = payload.Encoded,
                Label = envelope.Label,
                Description = envelope.Description,
                Icons = envelope.Icons.ToGameIcons(),
                Entities = envelope.Blueprint?.Entities.ToItemStats() ?? throw new ArgumentNullException(nameof(envelope.Blueprint)),
                Tiles = envelope.Blueprint?.Tiles.ToItemStats() ?? throw new ArgumentNullException(nameof(envelope.Blueprint)),
            };

        public static BookPayloadModel ToBookViewModel(this BlueprintPayload payload, IUrlHelper urlHelper, FactorioApi.BlueprintEnvelope envelope, PayloadCache? payloadGraph) =>
            new()
            {
                Links = urlHelper.BuildLinks(payload, envelope),
                Hash = payload.Hash,
                Type = payload.Type,
                GameVersion = payload.GameVersion,
                Encoded = payload.Encoded,
                Label = envelope.Label,
                Description = envelope.Description,
                Icons = envelope.Icons.ToGameIcons(),
                Children = payloadGraph != null ? MapChildren(urlHelper, envelope, payloadGraph) : null,
            };

        public static ProblemDetails ToProblem<T>(this T result) =>
            new()
            {
                Type = result?.GetType().Name ?? "unknown",
                Extensions =
                {
                    { "traceId", Activity.Current?.Id },
                    { "details", result },
                },
            };

        private static IEnumerable<PayloadModelBase> MapChildren(IUrlHelper urlHelper, FactorioApi.BlueprintEnvelope envelope, PayloadCache payloadGraph) =>
            envelope.BlueprintBook?.Blueprints?
                .Where(e => e.Blueprint != null || e.BlueprintBook != null)
                .Select(e => payloadGraph[e].ToViewModel(urlHelper, e, payloadGraph))
            ?? Enumerable.Empty<PayloadModelBase>();
    }
}
