using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace FactorioTech.Web.Core
{
    public class ImageService
    {
        private readonly ILogger<ImageService> _logger;
        private readonly FbsrClient _fbsrClient;

        public ImageService(ILogger<ImageService> logger, FbsrClient fbsrClient)
        {
            _logger = logger;
            _fbsrClient = fbsrClient;
        }

        public async Task<string> SaveBlueprintRendering(string blueprint)
        {
            var hash = CreateHash(blueprint);
            var imageFqfn = GetImageFqfn(hash);

            if (File.Exists(imageFqfn))
            {
                _logger.LogWarning(
                    "Attempted to save new blueprint rendering with hash {Hash}, but the file already exists at {ImageFqfn}",
                    hash, imageFqfn);

                return hash;
            }

            try
            {
                var image = await _fbsrClient.FetchBlueprintRendering(blueprint);

                await using var file = new FileStream(imageFqfn, FileMode.Create);
                await file.WriteAsync(image);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch or save blueprint rendering");
            }

            return hash;
        }

        public Stream GetBlueprintRendering(string hash)
        {
            var imageFqfn = GetImageFqfn(hash);

            if (!File.Exists(imageFqfn))
            {
                _logger.LogWarning(
                    "Attempted to load blueprint rendering with hash {Hash}, but the file does not exist at {ImageFqfn}",
                    hash, imageFqfn);

                return Stream.Null;
            }

            return new FileStream(imageFqfn, FileMode.Open);
        }

        private static string GetImageFqfn(string hash) =>
            Path.Combine(AppConfig.WorkingDir, "blueprints", $"{hash}.jpg");

        private static string CreateHash(string input) =>
            string.Join(string.Empty, MD5.Create()
                .ComputeHash(Encoding.UTF8.GetBytes(input))
                .Select(b => b.ToString("X2".ToLowerInvariant())));
    }
}
