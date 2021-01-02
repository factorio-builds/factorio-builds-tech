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
            IReadOnlyCollection<Blueprint> blueprints, BuildController.BuildsQueryParams query, bool hasMore)
        {
            var links = new Dictionary<string, LinkModel>();

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
            var coverUrl = urlHelper.ActionLink(nameof(BuildController.GetCover), "Build", new
            {
                buildId = blueprint.BlueprintId,
            });

            var selfUrl = urlHelper.ActionLink(nameof(BuildController.GetDetails), "Build", new
            {
                owner = blueprint.OwnerSlug,
                slug = blueprint.Slug,
            });

            return new Dictionary<string, LinkModel>
            {
                { "cover", new ImageLinkModel(coverUrl, AppConfig.Cover.Width, AppConfig.Cover.Height) },
                { "self", new LinkModel(selfUrl) },
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
                { "blueprint-editor", new LinkModel($"{appConfig.BlueprintEditorUri}/?source={rawUrl}") },
            };

            if (envelope.Blueprint != null)
            {
                links["rendering-full"] = new LinkModel(urlHelper.ActionLink(nameof(PayloadController.GetBlueprintRendering), "Payload", new
                {
                    hash = payload.Hash,
                    type = ImageService.RenderingType.Full,
                }));

                links["rendering-thumb"] = new LinkModel(urlHelper.ActionLink(nameof(PayloadController.GetBlueprintRendering), "Payload", new
                {
                    hash = payload.Hash,
                    type = ImageService.RenderingType.Thumb,
                }));
            }

            return links;
        }
    }
}
