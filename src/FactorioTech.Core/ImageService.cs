using FactorioTech.Core.Config;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Core
{
    public class ImageService
    {
        private readonly ILogger<ImageService> _logger;
        private readonly AppDbContext _dbContext;
        private readonly AppConfig _appConfig;
        private readonly BlueprintConverter _converter;
        private readonly FbsrClient _fbsrClient;

        public ImageService(
            ILogger<ImageService> logger,
            IOptions<AppConfig> appConfigMonitor,
            AppDbContext dbContext,
            BlueprintConverter converter,
            FbsrClient fbsrClient)
        {
            _logger = logger;
            _dbContext = dbContext;
            _appConfig = appConfigMonitor.Value;
            _converter = converter;
            _fbsrClient = fbsrClient;
        }

        public async Task SaveAllBlueprintRenderings(Guid versionId, PayloadCache cache, FactorioApi.BlueprintEnvelope envelope)
        {
            if (envelope.BlueprintBook?.Blueprints != null)
            {
                foreach (var inner in envelope.BlueprintBook.Blueprints)
                {
                    await SaveAllBlueprintRenderings(versionId, cache, inner);
                }
            }
            else if (envelope.Blueprint != null)
            {
                if (!cache.TryGetValue(envelope.Blueprint, out var payload))
                {
                    var encoded = await _converter.Encode(envelope.Blueprint);
                    payload = new BlueprintPayload(Hash.Compute(encoded), encoded, Utils.DecodeGameVersion(envelope.Version));
                    cache.TryAdd(envelope.Blueprint, payload);
                }

                await SaveBlueprintRendering(payload);
            }
        }

        public async Task SaveBlueprintRendering(BlueprintPayload payload)
        {
            var imageFqfn = GetRenderingFqfn(payload.Hash);
            if (File.Exists(imageFqfn))
            {
                _logger.LogWarning(
                    "Attempted to save new blueprint rendering with hash {Hash}, but the file already exists at {ImageFqfn}",
                    payload.Hash, imageFqfn);
                return;
            }

            var baseDir = Path.GetDirectoryName(imageFqfn);
            if (baseDir != null && !Directory.Exists(baseDir))
            {
                Directory.CreateDirectory(baseDir);
                _logger.LogInformation("Created directory {Dir}", baseDir);
            }

            try
            {
                await using var imageData = await _fbsrClient.FetchBlueprintRendering(payload.Encoded);
                using var image = await Image.LoadAsync(imageData);

                await using var outFile = new FileStream(imageFqfn, FileMode.CreateNew, FileAccess.Write);

                // quantize to 8bit to reduce size by about 50% (this is lossy but worth it)
                await image.SaveAsPngAsync(outFile, new PngEncoder
                {
                    ColorType = PngColorType.Palette,
                    CompressionLevel = PngCompressionLevel.BestCompression,
                    IgnoreMetadata = true,
                });

                var fileSize = outFile.Length;
                if (fileSize == 0)
                    throw new Exception($"Wrote 0 bytes to {imageFqfn}");

                _logger.LogInformation("Saved rendering {Type} for {Hash}: {Width}x{Height} - {FileSize} bytes",
                    "Full", payload.Hash, image.Width, image.Height, fileSize);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch or save blueprint rendering{Type} for {Hash}", "Full", payload.Hash);

                if (File.Exists(imageFqfn))
                {
                    File.Delete(imageFqfn);
                    _logger.LogWarning("Found and deleted existing blueprint rendering {Type} for failed {Hash}", "Full", payload.Hash);
                }
            }
        }

        public async Task<(Stream? File, string? MimeType)> TryLoadCover(Guid blueprintId)
        {
            var imageFqfn = GetCoverFqfn(blueprintId);
            if (!File.Exists(imageFqfn))
                return (null, null);

            var file = new FileStream(imageFqfn, FileMode.Open, FileAccess.Read);
            var format = await Image.DetectFormatAsync(file);

            return (file, format.DefaultMimeType);
        }

        public async Task<Stream?> TryLoadRendering(Guid? versionId, Hash hash)
        {
            var image = TryLoadRendering(hash);
            if (image != null)
                return image;

            var payload = await _dbContext.BlueprintPayloads.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Hash == hash);

            if (payload != null)
            {
                await SaveBlueprintRendering(payload);
                return TryLoadRendering(hash);
            }

            if (!versionId.HasValue)
                return null;

            var parentPayload = await _dbContext.BlueprintVersions.AsNoTracking()
                .Where(x => x.VersionId == versionId.Value)
                .Include(x => x.Payload)
                .FirstOrDefaultAsync();

            if (parentPayload == null)
                return null;

            var envelope = await _converter.Decode(parentPayload.Payload!.Encoded);
            payload = await TryFindEnvelopeWithHash(envelope, hash);
            if (payload == null)
                return null;

            await SaveBlueprintRendering(payload);

            return TryLoadRendering(hash);
        }

        public async Task<Stream?> TryLoadRenderingThumbnail(Guid? versionId, Hash hash)
        {
            var existingThumbnail = TryLoadRendering(hash, true);
            if (existingThumbnail != null)
                return existingThumbnail;

            var rendering = await TryLoadRendering(versionId, hash);
            if (rendering == null)
                return null;

            await SaveRenderingThumbnail(hash, rendering);

            return TryLoadRendering(hash, true);
        }

        public async Task SaveRenderingThumbnail(Hash hash, Stream rendering)
        {
            var (image, format) = await Image.LoadWithFormatAsync(rendering);
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(AppConfig.Cover.Width, AppConfig.Cover.Width),
                Mode = ResizeMode.Max,
            }));

            var imageFqfn = GetRenderingFqfn(hash, true);

            try {
                await using var outFile = new FileStream(imageFqfn, FileMode.OpenOrCreate, FileAccess.Write);
                await image.SaveAsync(outFile, format);

                var fileSize = outFile.Length;
                if (fileSize == 0)
                    throw new Exception($"Wrote 0 bytes to {imageFqfn}");

                _logger.LogInformation("Saved rendering {Type} for {Hash}: {Width}x{Height} - {FileSize} bytes",
                    "Thumb", hash, image.Width, image.Height, fileSize);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch or save blueprint rendering {Type} for {Hash}", "Thumb", hash);

                if (File.Exists(imageFqfn))
                {
                    File.Delete(imageFqfn);
                    _logger.LogWarning("Found and deleted existing blueprint rendering {Type} for failed {Hash}", "Thumb", hash);
                }
            }
        }

        private async Task<BlueprintPayload?> TryFindEnvelopeWithHash(FactorioApi.BlueprintEnvelope envelope, Hash targetHash)
        {
            if (envelope.Blueprint != null)
            {
                var encoded = await _converter.Encode(envelope.Blueprint);
                return Hash.Compute(encoded) == targetHash
                    ? new BlueprintPayload(targetHash, encoded, Utils.DecodeGameVersion(envelope.Version))
                    : null;
            }

            if (envelope.BlueprintBook?.Blueprints != null)
            {
                foreach (var innerEnvelope in envelope.BlueprintBook.Blueprints)
                {
                    var result = await TryFindEnvelopeWithHash(innerEnvelope, targetHash);
                    if (result != null)
                        return result;
                }
            }
         
            return null;
        }

        public async Task SaveCroppedCover(Guid blueprintId, Guid versionId, Hash hash, (int X, int Y, int Width, int Height) rectangle)
        {
            var rendering = await TryLoadRendering(versionId, hash);
            if (rendering == null)
            {
                _logger.LogCritical("Failed to load rendering for version {VersionId} with hash {Hash} to create blueprint image.",
                    versionId, hash);
            }
            else
            {
                await SaveCroppedCover(blueprintId, rendering, rectangle);
            }
        }

        public async Task SaveCroppedCover(Guid blueprintId, Stream stream, (int X, int Y, int Width, int Height) rectangle)
        {
            var (image, format) = await Image.LoadWithFormatAsync(stream);

            image.Mutate(x => x
                .Crop(new Rectangle(rectangle.X, rectangle.Y, rectangle.Width, rectangle.Height))
                .Resize(AppConfig.Cover.Width, AppConfig.Cover.Width));

            var imageFqfn = GetCoverFqfn(blueprintId);

            var baseDir = Path.GetDirectoryName(imageFqfn);
            if (baseDir != null && !Directory.Exists(baseDir))
            {
                Directory.CreateDirectory(baseDir);
            }

            await using var outFile = new FileStream(imageFqfn, FileMode.OpenOrCreate, FileAccess.Write);
            await image.SaveAsync(outFile, format);
        }

        private Stream? TryLoadRendering(Hash hash, bool thumbnail = false)
        {
            var fqfn = GetRenderingFqfn(hash, thumbnail);

            try
            {
                return File.Exists(fqfn) ? new FileStream(fqfn, FileMode.Open, FileAccess.Read) : null;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to read blueprint rendering");
                return null;
            }
        }

        private string GetRenderingFqfn(Hash hash, bool thumbnail = false) =>
            Path.Combine(_appConfig.WorkingDir, "renderings", thumbnail ? $"{hash}-thumb.png" : $"{hash}.png");

        private string GetCoverFqfn(Guid blueprintId) =>
            Path.Combine(_appConfig.WorkingDir, "covers", blueprintId.ToString());
    }
}
