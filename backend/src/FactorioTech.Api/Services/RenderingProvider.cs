using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp.Web;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web.Resolvers;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Api.Services
{
    public class RenderingProvider : IImageProvider
    {
        public ProcessingBehavior ProcessingBehavior => ProcessingBehavior.All;

        public Func<HttpContext, bool> Match { get; set; } = context =>
            context.Request.Path.StartsWithSegments("/images/renderings");

        public bool IsValidRequest(HttpContext context) =>
            Hash.TryParse(context.Request.Path.Value!.Split('/').Last(), out _);

        private readonly IFileProvider _fileProvider;

        public RenderingProvider(IFileProvider fileProvider)
        {
            _fileProvider = fileProvider;
        }

        public async Task<IImageResolver> GetAsync(HttpContext context)
        {
            var fileName = context.Request.Path.Value!.Split('/').Last();
            var fileInfo = _fileProvider.GetFileInfo(Path.Combine("renderings", $"{fileName}.png"));
            if (!fileInfo.Exists)
            {
                // service location isn't great, but there is no other way because this service
                // has to be singleton and the db context has to be request scoped.
                var imageService = context.RequestServices.GetRequiredService<ImageService>();
                fileInfo = await imageService.GetOrCreateRendering(Hash.Parse(fileName));
                if (!fileInfo.Exists)
                    return null!;
            }

            var metadata = new ImageMetadata(fileInfo.LastModified.UtcDateTime, fileInfo.Length);
            return new PhysicalFileSystemResolver(fileInfo, metadata);
        }
    }
}
