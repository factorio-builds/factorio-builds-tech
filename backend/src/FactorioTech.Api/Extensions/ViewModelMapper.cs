using FactorioTech.Api.Controllers;
using FactorioTech.Api.ViewModels;
using FactorioTech.Core;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace FactorioTech.Api.Extensions
{
    public static class ViewModelMapper
    {
        public static UsersModel ToViewModel(this IReadOnlyCollection<User> users) =>
            new()
            {
                Users = users.Select(ToViewModel),
                Count = users.Count,
            };

        public static UserModel ToViewModel(this User user) =>
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
                Links = urlHelper.BuildLinks(blueprint),
                Slug = blueprint.Slug,
                CreatedAt = blueprint.CreatedAt,
                UpdatedAt = blueprint.UpdatedAt,
                Icons = blueprint.Icons,
                Title = blueprint.Title,
                Owner = blueprint.Owner?.ToViewModel() ?? new ThinUserModel { Username = blueprint.OwnerSlug },
                LatestGameVersion = Version.Parse(blueprint.LatestGameVersion),
                Tags = blueprint.Tags?.Select(t => t.Value) ?? throw new ArgumentNullException(nameof(Blueprint.Tags)),
            };

        public static FullBuildModel ToFullViewModel(this Blueprint blueprint, IUrlHelper urlHelper, FactorioApi.BlueprintEnvelope envelope) =>
            new()
            {
                Links = urlHelper.BuildLinks(blueprint),
                Slug = blueprint.Slug,
                CreatedAt = blueprint.CreatedAt,
                UpdatedAt = blueprint.UpdatedAt,
                Icons = blueprint.Icons,
                Title = blueprint.Title,
                Description = blueprint.Description?.Let(description => new FullBuildModel.DescriptionModel
                {
                    Markdown = description,
                    Html = MarkdownConverter.ToHtml(description),
                }),
                LatestGameVersion = Version.Parse(blueprint.LatestGameVersion),
                LatestVersion = blueprint.LatestVersion?.ToFullViewModel(urlHelper, envelope) ?? throw new ArgumentNullException(nameof(Blueprint.LatestVersion)),
                Owner = blueprint.Owner?.ToViewModel() ?? throw new ArgumentNullException(nameof(Blueprint.Owner)),
                Tags = blueprint.Tags?.Select(t => t.Value) ?? throw new ArgumentNullException(nameof(Blueprint.Tags)),
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
                CreatedAt = version.CreatedAt,
                Name = version.Name,
                Description = version.Description,
            };

        public static FullVersionModel ToFullViewModel(this BlueprintVersion version, IUrlHelper urlHelper, FactorioApi.BlueprintEnvelope envelope) =>
            new()
            {
                Links = urlHelper.BuildLinks(version),
                Hash = version.Hash,
                CreatedAt = version.CreatedAt,
                Name = version.Name,
                Description = version.Description,
                Payload = version.Payload?.ToThinViewModel(urlHelper, envelope)
                          ?? throw new ArgumentNullException(nameof(BlueprintVersion.Payload)),
            };

        public static PayloadModelBase ToViewModel(this BlueprintPayload payload, IUrlHelper urlHelper, FactorioApi.BlueprintEnvelope envelope, PayloadCache? payloadGraph = null) =>
            payloadGraph == null
                ? payload.ToThinViewModel(urlHelper, envelope)
                : payload.ToFullViewModel(urlHelper, envelope, payloadGraph);

        public static ThinPayloadModel ToThinViewModel(this BlueprintPayload payload, IUrlHelper urlHelper, FactorioApi.BlueprintEnvelope envelope) =>
            new()
            {
                Links = urlHelper.BuildLinks(payload, envelope),
                Hash = payload.Hash,
                GameVersion = payload.GameVersion,
                Encoded = payload.Encoded,
                Blueprint = envelope.ToViewModel(),
            };

        public static FullPayloadModel ToFullViewModel(this BlueprintPayload payload, IUrlHelper urlHelper, FactorioApi.BlueprintEnvelope envelope, PayloadCache payloadGraph) =>
            new()
            {
                Links = urlHelper.BuildLinks(payload, envelope),
                Hash = payload.Hash,
                GameVersion = payload.GameVersion,
                Encoded = payload.Encoded,
                Blueprint = envelope.ToViewModel(),
                Children = envelope.BlueprintBook?.Blueprints?.Select(e => payloadGraph[e].ToFullViewModel(urlHelper, e, payloadGraph))
                           ?? Enumerable.Empty<FullPayloadModel>(),
            };

        public static BlueprintEnvelopeModel ToViewModel(this FactorioApi.BlueprintEnvelope envelope) =>
            new()
            {
                Type = envelope.Item,
                Label = envelope.Label,
                Description = envelope.Description,
                Entities = envelope.Blueprint?.Entities
                    .GroupBy(e => e.Name)
                    .OrderByDescending(g => g.Count())
                    .ToDictionary(g => g.Key.ToLowerInvariant(), g => g.Count())
                    ?? new Dictionary<string, int>(),
                Icons = envelope.Icons?
                    .OrderBy(i => i.Index)
                    .Select(i => new GameIcon((short)i.Index, i.Signal.Type, i.Signal.Name))
                    ?? Enumerable.Empty<GameIcon>(),
            };

        public static ProblemDetails ToProblem(this BlueprintService.CreateResult result) =>
            new()
            {
                Type = result.GetType().Name,
                Extensions =
                {
                    { "traceId", Activity.Current?.Id },
                    { "details", result },
                },
            };
    }
}
