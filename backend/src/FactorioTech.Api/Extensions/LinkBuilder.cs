using FactorioTech.Api.Controllers;
using FactorioTech.Api.ViewModels;
using FactorioTech.Core;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System.Collections.Generic;

namespace FactorioTech.Api.Extensions
{
    public static class LinkBuilder
    {
        public static IReadOnlyDictionary<string, LinkModel> BuildLinks(this IUrlHelper urlHelper,
            IReadOnlyCollection<Blueprint> blueprints, BuildsQueryParams query, bool hasMore)
        {
            var links = new Dictionary<string, LinkModel>
            {
                { "create_build", new LinkModel(urlHelper.ActionLink(nameof(BuildController.CreateBuild), "Build"), "post") },
                { "create_payload", new LinkModel(urlHelper.ActionLink(nameof(PayloadController.CreatePayload), "Payload"), "put") },
            };

            if (query.Page > 1)
            {
                links["prev"] = new LinkModel(urlHelper.ActionLink(nameof(BuildController.ListBuilds), "Build", query.ToValues(query.Page - 1)));
            }

            if (hasMore)
            {
                links["next"] = new LinkModel(urlHelper.ActionLink(nameof(BuildController.ListBuilds), "Build", query.ToValues(query.Page + 1)));
            }

            return links;
        }

        public static IReadOnlyDictionary<string, LinkModel> BuildLinks(this IUrlHelper urlHelper, Blueprint blueprint)
        {
            var buildIdValues = new
            {
                buildId = blueprint.BlueprintId,
            };

            var buildValues = new
            {
                owner = blueprint.OwnerSlug,
                slug = blueprint.Slug,
            };

            var coverUrl = urlHelper.ActionLink(nameof(BuildController.GetCover), "Build", buildIdValues);
            var selfUrl = urlHelper.ActionLink(nameof(BuildController.GetDetails), "Build", buildValues);
            var versionsUrl = urlHelper.ActionLink(nameof(BuildController.GetVersions), "Build", buildValues);
            var followersUrl = urlHelper.ActionLink(nameof(BuildController.GetFollowers), "Build", buildValues);
            var toggleFavoriteUrl = urlHelper.ActionLink(nameof(RpcController.ToggleFavorite), "Rpc", buildIdValues);

            return new Dictionary<string, LinkModel>
            {
                { "cover", new ImageLinkModel(coverUrl, AppConfig.Cover.Width, AppConfig.Cover.Height) },
                { "self", new LinkModel(selfUrl) },
                { "versions", new LinkModel(versionsUrl) },
                { "add_version", new LinkModel(versionsUrl, "post") },
                { "toggle_favorite", new LinkModel(toggleFavoriteUrl, "post") },
                { "followers", new LinkModel(followersUrl, ("count", blueprint.FollowerCount)) },
            };
        }

        public static IReadOnlyDictionary<string, LinkModel> BuildLinks(this IUrlHelper urlHelper, BlueprintVersion version) =>
            new Dictionary<string, LinkModel>
            {
                {
                    "payload", new LinkModel(urlHelper.ActionLink(nameof(PayloadController.GetDetails), "Payload", new
                    {
                        hash = version.Hash,
                        includeChildren = true,
                    }))
                },
            };

        public static IReadOnlyDictionary<string, LinkModel> BuildLinks(this IUrlHelper urlHelper, BlueprintPayload payload, FactorioApi.BlueprintEnvelope envelope)
        {
            var appConfig = urlHelper.ActionContext.HttpContext.RequestServices.GetRequiredService<IOptions<AppConfig>>().Value;
            var rawUrl = urlHelper.ActionLink(nameof(PayloadController.GetRaw), "Payload", new
            {
                hash = payload.Hash,
            });

            var selfUrl = urlHelper.ActionLink(nameof(PayloadController.GetDetails), "Payload", new
            {
                hash = payload.Hash,
                includeChildren = true,
            });

            var links = new Dictionary<string, LinkModel>
            {
                { "self", new LinkModel(selfUrl) },
                { "raw", new LinkModel(rawUrl) },
                { "blueprint_editor", new LinkModel($"{appConfig.BlueprintEditorUri}/?source={rawUrl}") },
            };

            if (envelope.Blueprint != null)
            {
                links["rendering_full"] = new LinkModel(urlHelper.ActionLink(nameof(PayloadController.GetBlueprintRendering), "Payload", new
                {
                    hash = payload.Hash,
                    type = ImageService.RenderingType.Full,
                }));

                links["rendering_thumb"] = new LinkModel(urlHelper.ActionLink(nameof(PayloadController.GetBlueprintRendering), "Payload", new
                {
                    hash = payload.Hash,
                    type = ImageService.RenderingType.Thumb,
                }));
            }

            return links;
        }
    }
}
