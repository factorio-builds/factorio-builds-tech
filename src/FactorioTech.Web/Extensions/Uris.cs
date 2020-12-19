using FactorioTech.Core;
using FactorioTech.Core.Config;
using FactorioTech.Core.Domain;
using FactorioTech.Web.Controllers;
using Microsoft.AspNetCore.Mvc;
using System;

namespace FactorioTech.Web.Extensions
{
    public static class Uris
    {
        public static string RawBlueprint(this IUrlHelper urlHelper, string owner, string slug, Hash? hash) =>
            hash.HasValue
                ? urlHelper.Action(nameof(RawController.GetVersion), "Raw", new { owner, slug, hash })
                : urlHelper.Action(nameof(RawController.GetLatest), "Raw", new { owner, slug });

        public static string BlueprintCover(this IUrlHelper urlHelper, Guid blueprintId) =>
            urlHelper.Action(nameof(FileController.GetBlueprintCover), "File", new { blueprintId });

        public static string BlueprintRenderingThumb(this IUrlHelper urlHelper, Hash hash, Guid versionId) =>
            versionId == Guid.Empty
                ? urlHelper.Action(nameof(FileController.GetBlueprintRenderingThumb), "File", new { hash })
                : urlHelper.Action(nameof(FileController.GetBlueprintRenderingThumbWithVersionHint), "File", new { hash, versionId });

        public static string BlueprintRenderingFull(this IUrlHelper urlHelper, Hash hash, Guid versionId) =>
            versionId == Guid.Empty
                ? urlHelper.Action(nameof(FileController.GetBlueprintRenderingFull), "File", new { hash })
                : urlHelper.Action(nameof(FileController.GetBlueprintRenderingFullWithVersionHint), "File", new { hash, versionId });

        public static string BlueprintEditor(this IUrlHelper urlHelper, string owner, string slug, Hash hash) =>
            urlHelper.ActionLink(nameof(RawController.GetVersion), "Raw", new { owner, slug, hash = hash.ToString() })
                .Let(url => $"{AppConfig.BlueprintEditorUri}/?source={url}");

        public static string Icon(this IUrlHelper urlHelper, int size, string key, string type = "item") =>
            urlHelper.Action(nameof(FileController.GetGameIcon), "File", new { size, key, type });
    }
}
