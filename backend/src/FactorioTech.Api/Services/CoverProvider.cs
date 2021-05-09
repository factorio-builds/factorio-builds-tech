using FactorioTech.Core;
using Microsoft.AspNetCore.Http;
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

        public Func<HttpContext, bool> Match { get; set; } = context =>
            context.Request.Path.StartsWithSegments("/images/covers");

        public bool IsValidRequest(HttpContext context) =>
            context.Request.Path.Value!.Split('/').LastOrDefault().Let(fileName => 
                fileName != null
                && Path.GetExtension(fileName) != string.Empty
                && Path.GetFileNameWithoutExtension(fileName) != string.Empty);

        private readonly IFileProvider _fileProvider;

        public CoverProvider(IFileProvider fileProvider)
        {
            _fileProvider = fileProvider;
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
