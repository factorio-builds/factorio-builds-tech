using FactorioTech.Api.Controllers;
using FactorioTech.Api.ViewModels;
using FactorioTech.Core;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace FactorioTech.Api.Services
{
    public static class ViewModelMapper
    {
        public static BuildsModel ToViewModel(this IReadOnlyCollection<Blueprint> blueprints,
            IUrlHelper urlHelper, BuildController.BuildsQueryParams query, bool hasMore, int totalCount) =>
            new()
            {
                Links = urlHelper.BuildLinks(blueprints, query, hasMore),
                Builds = blueprints.Take(BuildController.BuildsQueryParams.PageSize).Select(b => b.ToThinViewModel(urlHelper)),
                CurrentCount = Math.Min(blueprints.Count, BuildController.BuildsQueryParams.PageSize),
                TotalCount = totalCount,
            };

        public static ThinBuildModel ToThinViewModel(this Blueprint blueprint, IUrlHelper urlHelper) =>
            new()
            {
                Links = urlHelper.BuildLinks(blueprint),
                Slug = blueprint.Slug,
                CreatedAt = blueprint.CreatedAt,
                UpdatedAt = blueprint.UpdatedAt,
                Title = blueprint.Title,
                Owner = blueprint.Owner?.ToViewModel() ?? new ThinUserModel { Username = blueprint.OwnerSlug },
                LatestGameVersion = Version.Parse(blueprint.LatestGameVersion),
            };

        public static FullBuildModel ToFullViewModel(this Blueprint blueprint, IUrlHelper urlHelper, FactorioApi.BlueprintEnvelope envelope) =>
            new()
            {
                Links = urlHelper.BuildLinks(blueprint),
                Slug = blueprint.Slug,
                CreatedAt = blueprint.CreatedAt,
                UpdatedAt = blueprint.UpdatedAt,
                Title = blueprint.Title,
                Description = blueprint.Description?.Let(description => new FullBuildModel.DescriptionModel
                {
                    Markdown = description,
                    Html = MarkdownConverter.ToHtml(description),
                }),
                LatestGameVersion = Version.Parse(blueprint.LatestGameVersion),
                LatestVersion = blueprint.LatestVersion?.ToViewModel(urlHelper, envelope) ?? throw new ArgumentNullException(nameof(Blueprint.LatestVersion)),
                Owner = blueprint.Owner?.ToViewModel() ?? throw new ArgumentNullException(nameof(Blueprint.Owner)),
                Tags = blueprint.Tags?.Select(t => t.Value) ?? throw new ArgumentNullException(nameof(Blueprint.Tags)),
            };

        public static UserModel ToViewModel(this User user) =>
            new()
            {
                Username = user.UserName,
                DisplayName = user.DisplayName,
                RegisteredAt = user.RegisteredAt,
            };

        public static VersionModel ToViewModel(this BlueprintVersion version, IUrlHelper urlHelper, FactorioApi.BlueprintEnvelope envelope) =>
            new()
            {
                Links = urlHelper.BuildLinks(version),
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
                    .Select(i => new BlueprintEnvelopeModel.Entity(i.Signal.Type, i.Signal.Name))
                    ?? Enumerable.Empty<BlueprintEnvelopeModel.Entity>(),
            };
    }
}
