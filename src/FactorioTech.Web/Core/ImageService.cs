using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using System.Threading.Tasks;

namespace FactorioTech.Web.Core
{
    public class ImageService
    {
        private readonly ILogger<ImageService> _logger;
        private readonly AppConfig _appConfig;
        private readonly BlueprintConverter _converter;
        private readonly FbsrClient _fbsrClient;

        public ImageService(
            ILogger<ImageService> logger,
            IOptions<AppConfig> appConfigMonitor,
            BlueprintConverter converter,
            FbsrClient fbsrClient)
        {
            _logger = logger;
            _appConfig = appConfigMonitor.Value;
            _converter = converter;
            _fbsrClient = fbsrClient;
        }

        public async Task SaveAllBlueprintRenderings(BlueprintMetadataCache metadataCache, FactorioApi.BlueprintEnvelope envelope)
        {
            if (envelope.BlueprintBook != null)
            {
                foreach (var inner in envelope.BlueprintBook.Blueprints)
                {
                    await SaveAllBlueprintRenderings(metadataCache, inner);
                }
            }
            else if (envelope.Blueprint != null)
            {
                if (!metadataCache.TryGetValue(envelope.Blueprint, out var metadata))
                {
                    var encoded = await _converter.Encode(envelope.Blueprint);
                    metadata = new BlueprintMetadata(encoded, Utils.ComputeHash(encoded));
                    metadataCache.TryAdd(envelope.Blueprint, metadata);
                }

                await SaveBlueprintRendering(metadata);
            }
        }

        public async Task SaveBlueprintRendering(BlueprintMetadata blueprintMetadata)
        {
            var imageFqfn = GetImageFqfn(blueprintMetadata.Hash);

            if (File.Exists(imageFqfn))
            {
                _logger.LogWarning(
                    "Attempted to save new blueprint rendering with hash {Hash}, but the file already exists at {ImageFqfn}",
                    blueprintMetadata.Hash, imageFqfn);
            }

            try
            {
                await using var image = await _fbsrClient.FetchBlueprintRendering(blueprintMetadata.Encoded);

                var baseDir = Path.GetDirectoryName(imageFqfn);
                if (baseDir != null && !Directory.Exists(baseDir))
                {
                    Directory.CreateDirectory(baseDir);
                }

                await using var file = new FileStream(imageFqfn, FileMode.Create);
                await image.CopyToAsync(file);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch or save blueprint rendering");
            }
        }

        public Stream? GetBlueprintRendering(string hash)
        {
            var imageFqfn = GetImageFqfn(hash);

            if (!File.Exists(imageFqfn))
            {
                _logger.LogWarning(
                    "Attempted to load blueprint rendering with hash {Hash}, but the file does not exist at {ImageFqfn}",
                    hash, imageFqfn);

                return null;
            }

            return new FileStream(imageFqfn, FileMode.Open);
        }

        private string GetImageFqfn(string hash) =>
            Path.Combine(_appConfig.WorkingDir, "blueprints", $"{hash}.png");
    }
}
