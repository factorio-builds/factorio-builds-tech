using FactorioTech.Api.Controllers;
using FactorioTech.Api.ViewModels;
using FactorioTech.Core;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace FactorioTech.Api.Services
{
    public static class LinkBuilder
    {
        public static BuildsLinks BuildLinks(this IUrlHelper urlHelper, IEnumerable<Blueprint> blueprints, BuildsQueryParams query, bool hasMore) =>
            new()
            {
                CreateBuild = urlHelper.ActionContext.HttpContext.User.Identity?.IsAuthenticated == true
                    ? new(urlHelper.ActionLink(nameof(BuildController.CreateBuild), "Build"), "post")
                    : null,

                CreatePayload = urlHelper.ActionContext.HttpContext.User.Identity?.IsAuthenticated == true
                    ? new(urlHelper.ActionLink(nameof(PayloadController.CreatePayload), "Payload"), "put")
                    : null,

                Prev = query.Page > 1
                    ? new(urlHelper.ActionLink(nameof(BuildController.ListBuilds), "Build", query.ToValues(query.Page - 1)))
                    : null,

                Next = hasMore
                    ? new(urlHelper.ActionLink(nameof(BuildController.ListBuilds), "Build", query.ToValues(query.Page + 1)))
                    : null,
            };

        public static ThinBuildLinks BuildThinLinks(this IUrlHelper urlHelper, Blueprint blueprint)
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

            return new()
            {
                Self = new(urlHelper.ActionLink(nameof(BuildController.GetDetails), "Build", buildValues)),
                Cover = new(urlHelper.ActionLink(nameof(BuildController.GetCover), "Build", buildIdValues), AppConfig.Cover.Width, AppConfig.Cover.Height),
                Versions = new(urlHelper.ActionLink(nameof(BuildController.GetVersions), "Build", buildValues)),
                Followers = new (urlHelper.ActionLink(nameof(BuildController.GetFollowers), "Build", buildValues), blueprint.FollowerCount),

                AddVersion = urlHelper.ActionContext.HttpContext.User.CanAddVersion(blueprint)
                    ? new(urlHelper.ActionLink(nameof(BuildController.GetVersions), "Build", buildValues), "post")
                    : null,

                Edit = urlHelper.ActionContext.HttpContext.User.CanEdit(blueprint)
                    ? new(urlHelper.ActionLink(nameof(BuildController.EditDetails), "Build", buildValues), "put")
                    : null,

                Delete = urlHelper.ActionContext.HttpContext.User.CanDelete(blueprint)
                    ? new(urlHelper.ActionLink(nameof(BuildController.DeleteBuild), "Build", buildValues), "delete")
                    : null,
            };
        }

        public static FullBuildLinks BuildFullLinks(this IUrlHelper urlHelper, Blueprint blueprint, bool currentUserIsFollower)
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

            return new()
            {
                Self = new(urlHelper.ActionLink(nameof(BuildController.GetDetails), "Build", buildValues)),
                Cover = new(urlHelper.ActionLink(nameof(BuildController.GetCover), "Build", buildIdValues), AppConfig.Cover.Width, AppConfig.Cover.Height),
                Versions = new(urlHelper.ActionLink(nameof(BuildController.GetVersions), "Build", buildValues)),
                Followers = new (urlHelper.ActionLink(nameof(BuildController.GetFollowers), "Build", buildValues), blueprint.FollowerCount),

                AddFavorite = urlHelper.ActionContext.HttpContext.User.Identity?.IsAuthenticated == true && currentUserIsFollower == false
                    ? new(urlHelper.ActionLink(nameof(BuildController.AddFavorite), "Build", buildValues), "put")
                    : null,

                RemoveFavorite = urlHelper.ActionContext.HttpContext.User.Identity?.IsAuthenticated == true && currentUserIsFollower
                    ? new(urlHelper.ActionLink(nameof(BuildController.RemoveFavorite), "Build", buildValues), "delete")
                    : null,

                AddVersion = urlHelper.ActionContext.HttpContext.User.CanAddVersion(blueprint)
                    ? new(urlHelper.ActionLink(nameof(BuildController.GetVersions), "Build", buildValues), "post")
                    : null,

                Edit = urlHelper.ActionContext.HttpContext.User.CanEdit(blueprint)
                    ? new(urlHelper.ActionLink(nameof(BuildController.EditDetails), "Build", buildValues), "put")
                    : null,

                Delete = urlHelper.ActionContext.HttpContext.User.CanDelete(blueprint)
                    ? new(urlHelper.ActionLink(nameof(BuildController.DeleteBuild), "Build", buildValues), "delete")
                    : null,
            };
        }

        public static VersionLinks BuildLinks(this IUrlHelper urlHelper, BlueprintVersion version) =>
            new()
            {
                Payload = new(urlHelper.ActionLink(nameof(PayloadController.GetDetails), "Payload", new
                {
                    hash = version.Hash,
                    include_children = "true",
                })),
            };

        public static PayloadLinks BuildLinks(this IUrlHelper urlHelper, BlueprintPayload payload, FactorioApi.BlueprintEnvelope envelope) =>
            new()
            {
                Self = new(urlHelper.ActionLink(nameof(PayloadController.GetDetails), "Payload", new
                {
                    hash = payload.Hash,
                    include_children = "true",
                })),

                Raw = new (urlHelper.ActionLink(nameof(PayloadController.GetRaw), "Payload", new
                {
                    hash = payload.Hash,
                })),

                RenderingFull = envelope.Blueprint != null
                    ? new(urlHelper.ActionLink(nameof(PayloadController.GetBlueprintRendering), "Payload", new
                    {
                        hash = payload.Hash,
                        type = ImageService.RenderingType.Full.ToString().ToLowerInvariant(),
                    }))
                    : null,

                RenderingThumb = envelope.Blueprint != null
                    ? new(urlHelper.ActionLink(nameof(PayloadController.GetBlueprintRendering), "Payload", new
                    {
                        hash = payload.Hash,
                        type = ImageService.RenderingType.Thumb.ToString().ToLowerInvariant(),
                    }))
                    : null,
            };
    }
}
