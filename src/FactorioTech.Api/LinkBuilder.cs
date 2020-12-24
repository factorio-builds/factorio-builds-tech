using FactorioTech.Api.Controllers;
using FactorioTech.Api.ViewModels;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace FactorioTech.Api
{
    public static class LinkBuilder
    {
        public static IEnumerable<LinkModel> GetLinks(this IUrlHelper urlHelper, Blueprint blueprint) =>
            new LinkModel[]
            {
                new ("cover", urlHelper.Action(nameof(BuildController.GetCover), "Build", new
                {
                    buildId = blueprint.BlueprintId
                })),
            };

        public static IEnumerable<LinkModel> GetLinks(this IUrlHelper urlHelper, BlueprintPayload payload) =>
            new LinkModel[]
            {
                new ("rendering-full", urlHelper.Action(nameof(PayloadController.GetBlueprintRendering), "Payload", new
                {
                    hash = payload.Hash,
                    type = ImageService.RenderingType.Full
                })),
                new ("rendering-thumb", urlHelper.Action(nameof(PayloadController.GetBlueprintRendering), "Payload", new
                {
                    hash = payload.Hash,
                    type = ImageService.RenderingType.Thumb
                })),
            };
    }
}
