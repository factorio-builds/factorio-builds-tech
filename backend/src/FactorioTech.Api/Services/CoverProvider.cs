using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
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
    public class CoverProvider : IImageProvider
    {
        public ProcessingBehavior ProcessingBehavior => ProcessingBehavior.All;
        public Func<HttpContext, bool> Match { get; set; } = ctx => ctx.Request.Path.StartsWithSegments("/covers");
        public bool IsValidRequest(HttpContext context) => _formatUtilities.GetExtensionFromUri(context.Request.GetDisplayUrl()) != null;

        private readonly IFileProvider _fileProvider;
        private readonly FormatUtilities _formatUtilities;

        public CoverProvider(
            IFileProvider fileProvider,
            FormatUtilities formatUtilities)
        {
            _fileProvider = fileProvider;
            _formatUtilities = formatUtilities;
        }

        public Task<IImageResolver> GetAsync(HttpContext context)
        {
            var fileName = context.Request.Path.Value!.Split('/').Last();
            var fileInfo = _fileProvider.GetFileInfo(Path.Combine("covers", fileName));
            if (!fileInfo.Exists)
                return Task.FromResult<IImageResolver>(null!);

            var metadata = new ImageMetadata(fileInfo.LastModified.UtcDateTime, fileInfo.Length);
            return Task.FromResult<IImageResolver>(new PhysicalFileSystemResolver(fileInfo, metadata));
        }
    }
}
