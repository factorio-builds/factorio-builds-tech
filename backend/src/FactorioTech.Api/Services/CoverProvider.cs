using FactorioTech.Core;
using FactorioTech.Core.Services;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web.Resolvers;
using SixLabors.ImageSharp.Web.Resolvers.Azure;

namespace FactorioTech.Api.Services;

public class CoverProvider : IImageProvider
{
    public ProcessingBehavior ProcessingBehavior => ProcessingBehavior.All;

    public Func<HttpContext, bool> Match { get; set; } = context =>
        context.Request.Path.StartsWithSegments("/images/covers");

    public bool IsValidRequest(HttpContext context) => true; // todo - strongly type and check image id

    public async Task<IImageResolver?> GetAsync(HttpContext context)
    {
        var imageService = context.RequestServices.GetRequiredService<ImageService>();
        var imageId = context.Request.Path.Value!.Split('/').Last();
        var blob = await imageService.GetCover(imageId);
        return blob != null ? new AzureBlobStorageImageResolver(blob) : null;
    }
}
