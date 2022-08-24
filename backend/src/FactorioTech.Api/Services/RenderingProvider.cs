using FactorioTech.Core;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web.Resolvers;
using SixLabors.ImageSharp.Web.Resolvers.Azure;

namespace FactorioTech.Api.Services;

public class RenderingProvider : IImageProvider
{
    public ProcessingBehavior ProcessingBehavior => ProcessingBehavior.All;

    public Func<HttpContext, bool> Match { get; set; } = context =>
        context.Request.Path.StartsWithSegments("/images/renderings");

    public bool IsValidRequest(HttpContext context) =>
        Hash.TryParse(context.Request.Path.Value!.Split('/').Last(), out _);

    public async Task<IImageResolver?> GetAsync(HttpContext context)
    {
        var imageService = context.RequestServices.GetRequiredService<ImageService>();
        var hash = context.Request.Path.Value!.Split('/').Last().Let(Hash.Parse);
        var blob = await imageService.GetOrCreateRendering(hash);
        return blob != null ? new AzureBlobStorageImageResolver(blob) : null;
    }
}
