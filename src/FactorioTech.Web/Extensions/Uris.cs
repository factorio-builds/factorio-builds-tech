using FactorioTech.Core;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using FactorioTech.Web.Controllers;
using Microsoft.AspNetCore.Mvc;
using System;

namespace FactorioTech.Web.Extensions
{
    public static class Uris
    {
        public static string BlueprintCover(this IUrlHelper urlHelper, Guid blueprintId) =>
            urlHelper.Action(nameof(FileController.GetBlueprintCover), "File", new { blueprintId });

        public static string BlueprintRendering(this IUrlHelper urlHelper, Hash hash, ImageService.RenderingType type) =>
            urlHelper.Action(nameof(FileController.GetBlueprintRendering), "File", new { type, hash });

        public static string BlueprintRaw(this IUrlHelper urlHelper, string owner, string slug) =>
            urlHelper.Action(nameof(RawController.GetLatest), "Raw", new { owner, slug });

        public static string BlueprintRaw(this IUrlHelper urlHelper, Hash hash) =>
            urlHelper.Action(nameof(RawController.GetPayload), "Raw", new { hash });

        public static string BlueprintEditor(this IUrlHelper urlHelper, Hash hash) =>
            urlHelper.ActionLink(nameof(RawController.GetPayload), "Raw", new { hash })
                .Let(url => $"{AppConfig.BlueprintEditorUri}/?source={url}");

        public static string Icon(this IUrlHelper urlHelper, int size, string key, string type = "item") =>
            urlHelper.Action(nameof(FileController.GetGameIcon), "File", new { size, key, type });
    }
}
