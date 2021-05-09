using FactorioTech.Api.Controllers;
using FactorioTech.Api.ViewModels;
using FactorioTech.Core;
using FactorioTech.Core.Domain;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace FactorioTech.Api.Services
{
    public static class LinkBuilder
    {
        public static BuildsLinks BuildLinks(this IUrlHelper urlHelper, IEnumerable<Build> builds, BuildsQueryParams query, bool hasMore) =>
            new()
            {
                CreateBuild = urlHelper.ActionContext.HttpContext.User.Identity?.IsAuthenticated == true
                    ? new(urlHelper.ActionLink(nameof(BuildController.CreateBuild), "Build"), HttpMethod.Post)
                    : null,

                CreatePayload = urlHelper.ActionContext.HttpContext.User.Identity?.IsAuthenticated == true
                    ? new(urlHelper.ActionLink(nameof(PayloadController.CreatePayload), "Payload"), HttpMethod.Put)
                    : null,

                Prev = query.Page > 1
                    ? new(urlHelper.ActionLink(nameof(BuildController.ListBuilds), "Build", query.ToValues(query.Page - 1)))
                    : null,

                Next = hasMore
                    ? new(urlHelper.ActionLink(nameof(BuildController.ListBuilds), "Build", query.ToValues(query.Page + 1)))
                    : null,
            };

        public static ThinBuildLinks BuildThinLinks(this IUrlHelper urlHelper, Build build)
        {
            var buildValues = new
            {
                owner = build.OwnerSlug,
                slug = build.Slug,
            };

            return new()
            {
                Self = new(urlHelper.ActionLink(nameof(BuildController.GetDetails), "Build", buildValues)),
                Versions = new(urlHelper.ActionLink(nameof(BuildController.GetVersions), "Build", buildValues)),
                Followers = new (urlHelper.ActionLink(nameof(BuildController.GetFollowers), "Build", buildValues), build.FollowerCount),

                Cover = new(urlHelper.AbsolueUrl($"images/covers/{build.CoverMeta.FileName}"),
                    build.CoverMeta.Width, build.CoverMeta.Height, build.CoverMeta.Size),

                AddVersion = urlHelper.ActionContext.HttpContext.User.CanAddVersion(build)
                    ? new(urlHelper.ActionLink(nameof(BuildController.GetVersions), "Build", buildValues), HttpMethod.Post)
                    : null,

                Edit = urlHelper.ActionContext.HttpContext.User.CanEdit(build)
                    ? new(urlHelper.ActionLink(nameof(BuildController.EditDetails), "Build", buildValues), HttpMethod.Patch)
                    : null,

                Delete = urlHelper.ActionContext.HttpContext.User.CanDelete(build)
                    ? new(urlHelper.ActionLink(nameof(BuildController.DeleteBuild), "Build", buildValues), HttpMethod.Delete)
                    : null,
            };
        }

        public static FullBuildLinks BuildFullLinks(this IUrlHelper urlHelper, Build build, bool currentUserIsFollower)
        {
            var buildValues = new
            {
                owner = build.OwnerSlug,
                slug = build.Slug,
            };

            return new()
            {
                Self = new(urlHelper.ActionLink(nameof(BuildController.GetDetails), "Build", buildValues)),
                Versions = new(urlHelper.ActionLink(nameof(BuildController.GetVersions), "Build", buildValues)),
                Followers = new (urlHelper.ActionLink(nameof(BuildController.GetFollowers), "Build", buildValues), build.FollowerCount),

                Cover = new(urlHelper.AbsolueUrl($"images/covers/{build.CoverMeta.FileName}"),
                    build.CoverMeta.Width, build.CoverMeta.Height, build.CoverMeta.Size),

                AddFavorite = urlHelper.ActionContext.HttpContext.User.Identity?.IsAuthenticated == true && currentUserIsFollower == false
                    ? new(urlHelper.ActionLink(nameof(BuildController.AddFavorite), "Build", buildValues), HttpMethod.Put)
                    : null,

                RemoveFavorite = urlHelper.ActionContext.HttpContext.User.Identity?.IsAuthenticated == true && currentUserIsFollower
                    ? new(urlHelper.ActionLink(nameof(BuildController.RemoveFavorite), "Build", buildValues), HttpMethod.Delete)
                    : null,

                AddVersion = urlHelper.ActionContext.HttpContext.User.CanAddVersion(build)
                    ? new(urlHelper.ActionLink(nameof(BuildController.GetVersions), "Build", buildValues), HttpMethod.Post)
                    : null,

                Edit = urlHelper.ActionContext.HttpContext.User.CanEdit(build)
                    ? new(urlHelper.ActionLink(nameof(BuildController.EditDetails), "Build", buildValues), HttpMethod.Patch)
                    : null,

                Delete = urlHelper.ActionContext.HttpContext.User.CanDelete(build)
                    ? new(urlHelper.ActionLink(nameof(BuildController.DeleteBuild), "Build", buildValues), HttpMethod.Delete)
                    : null,
            };
        }

        public static VersionLinks BuildLinks(this IUrlHelper urlHelper, BuildVersion version) =>
            new()
            {
                Payload = new(urlHelper.ActionLink(nameof(PayloadController.GetDetails), "Payload", new
                {
                    hash = version.Hash,
                    include_children = "true",
                })),
            };

        public static PayloadLinks BuildLinks(this IUrlHelper urlHelper, Payload payload, FactorioApi.BlueprintEnvelope envelope) =>
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

                Rendering = envelope.Blueprint != null
                    ? new(urlHelper.AbsolueUrl($"images/renderings/{payload.Hash}"))
                    : null,

                DeleteRendering = envelope.Blueprint != null && urlHelper.ActionContext.HttpContext.User.CanDeleteRendering(payload)
                    ? new(urlHelper.ActionLink(nameof(PayloadController.DeleteRendering), "Payload", new { hash = payload.Hash, }), HttpMethod.Delete)
                    : null,
            };

        private static string AbsolueUrl(this IUrlHelper url, string path) =>
            url.ActionContext.HttpContext.Request
                .Let(request => new Uri(new Uri($"{request.Scheme}://{request.Host.Value}"), path))
                .ToString();
    }
}
