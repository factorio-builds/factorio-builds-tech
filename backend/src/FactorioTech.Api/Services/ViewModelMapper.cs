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

        public static BuildsModel ToViewModel(this IReadOnlyCollection<Build> builds,
            IUrlHelper urlHelper, BuildsQueryParams query, bool hasMore, int totalCount) =>
            new()
            {
                Links = urlHelper.BuildLinks(builds, query, hasMore),
                Builds = builds.Select(b => b.ToThinViewModel(urlHelper)),
                CurrentCount = builds.Count,
                TotalCount = totalCount,
            };

        public static ThinBuildModel ToThinViewModel(this Build build, IUrlHelper urlHelper) =>
            new()
            {
                Links = urlHelper.BuildThinLinks(build),
                Slug = build.Slug,
                CreatedAt = build.CreatedAt,
                UpdatedAt = build.UpdatedAt,
                Icons = build.Icons,
                Title = build.Title,
                Description = build.Description,
                Owner = build.Owner?.ToViewModel() ?? new ThinUserModel { Username = build.OwnerSlug },
                LatestType = build.LatestType,
                LatestGameVersion = Version.Parse(build.LatestGameVersion),
                Tags = build.Tags,
            };

        public static FullBuildModel ToFullViewModel(this Build build, IUrlHelper urlHelper,
            FactorioApi.BlueprintEnvelope envelope, bool currentUserIsFollower) =>
            new()
            {
                Links = urlHelper.BuildFullLinks(build, currentUserIsFollower),
                Slug = build.Slug,
                CreatedAt = build.CreatedAt,
                UpdatedAt = build.UpdatedAt,
                Icons = build.Icons,
                Title = build.Title,
                Description = build.Description,
                LatestType = build.LatestType,
                LatestGameVersion = Version.Parse(build.LatestGameVersion),
                LatestVersion = build.LatestVersion?.ToFullViewModel(urlHelper, envelope) ?? throw new ArgumentNullException(nameof(build.LatestVersion)),
                Tags = build.Tags,
                Owner = build.Owner?.ToViewModel() ?? throw new ArgumentNullException(nameof(build.Owner)),
            };

        public static VersionsModel ToViewModel(this IReadOnlyCollection<BuildVersion> versions, IUrlHelper urlHelper) =>
            new()
            {
                Count = versions.Count,
                Versions = versions.Select(v => v.ToThinViewModel(urlHelper)),
            };

        public static ThinVersionModel ToThinViewModel(this BuildVersion version, IUrlHelper urlHelper) =>
            new()
            {
                Links = urlHelper.BuildLinks(version),
                Hash = version.Hash,
                Type = version.Type,
                CreatedAt = version.CreatedAt,
                Name = version.Name,
                Description = version.Description,
            };

        public static FullVersionModel ToFullViewModel(this BuildVersion version, IUrlHelper urlHelper,
            FactorioApi.BlueprintEnvelope envelope) =>
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

        public static PayloadModelBase ToViewModel(this Payload payload, IUrlHelper urlHelper,
            FactorioApi.BlueprintEnvelope envelope, PayloadCache? payloadGraph = null) =>
            payload.Type switch
            {
                PayloadType.Blueprint => payload.ToBlueprintViewModel(urlHelper, envelope),
                PayloadType.Book => payload.ToBookViewModel(urlHelper, envelope, payloadGraph),
                _ => throw new ArgumentOutOfRangeException(nameof(payload.Type)),
            };

        public static BlueprintPayloadModel ToBlueprintViewModel(this Payload payload, IUrlHelper urlHelper,
            FactorioApi.BlueprintEnvelope envelope) =>
            new()
            {
                Links = urlHelper.BuildLinks(payload, envelope),
                Hash = payload.Hash,
                Type = payload.Type,
                GameVersion = payload.GameVersion,
                Encoded = payload.Encoded,
                Label = envelope.Entity.Label,
                Description = envelope.Entity.Description,
                Icons = envelope.Entity.Icons.ToGameIcons(),
                Entities = envelope.Blueprint?.Entities.ToItemStats() ?? throw new ArgumentNullException(nameof(envelope.Blueprint)),
                Tiles = envelope.Blueprint?.Tiles.ToItemStats() ?? throw new ArgumentNullException(nameof(envelope.Blueprint)),
            };

        public static BookPayloadModel ToBookViewModel(this Payload payload, IUrlHelper urlHelper,
            FactorioApi.BlueprintEnvelope envelope, PayloadCache? payloadGraph) =>
            new()
            {
                Links = urlHelper.BuildLinks(payload, envelope),
                Hash = payload.Hash,
                Type = payload.Type,
                GameVersion = payload.GameVersion,
                Encoded = payload.Encoded,
                Label = envelope.Entity.Label,
                Description = envelope.Entity.Description,
                Icons = envelope.Entity.Icons.ToGameIcons(),
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

        private static IEnumerable<PayloadModelBase> MapChildren(IUrlHelper urlHelper,
            FactorioApi.BlueprintEnvelope envelope, PayloadCache payloadGraph) =>
            envelope.BlueprintBook?.Blueprints?
                .Where(e => e.Blueprint != null || e.BlueprintBook != null)
                .Select(e => payloadGraph[e].ToViewModel(urlHelper, e, payloadGraph))
            ?? Enumerable.Empty<PayloadModelBase>();
    }
}
