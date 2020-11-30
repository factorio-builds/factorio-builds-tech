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
        private readonly AppDbContext _ctx;
        private readonly AppConfig _appConfig;
        private readonly BlueprintConverter _converter;
        private readonly FbsrClient _fbsrClient;

        public ImageService(
            ILogger<ImageService> logger,
            IOptions<AppConfig> appConfigMonitor,
            AppDbContext ctx,
            BlueprintConverter converter,
            FbsrClient fbsrClient)
        {
            _logger = logger;
            _ctx = ctx;
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
            }

            try
            {
                await using var outFile = new FileStream(imageFqfn, FileMode.CreateNew, FileAccess.Write);
                await using var imageData = await _fbsrClient.FetchBlueprintRendering(payload.Encoded);
                using var image = await Image.LoadAsync(imageData);

                // quantize to 8bit to reduce size by about 50% (this is lossy but worth it)
                await image.SaveAsPngAsync(outFile, new PngEncoder
                {
                    ColorType = PngColorType.Palette,
                    CompressionLevel = PngCompressionLevel.BestCompression,
                    IgnoreMetadata = true,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch or save blueprint rendering");
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

            var payload = await _ctx.BlueprintPayloads.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Hash == hash);

            if (payload != null)
            {
                await SaveBlueprintRendering(payload);
                return TryLoadRendering(hash);
            }

            if (!versionId.HasValue)
                return null;

            var parentPayload = await _ctx.BlueprintVersions.AsNoTracking()
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

        private Stream? TryLoadRendering(Hash hash) =>
            GetRenderingFqfn(hash).Let(fqfn => File.Exists(fqfn) ? new FileStream(fqfn, FileMode.Open, FileAccess.Read) : null);

        private string GetRenderingFqfn(Hash hash) =>
            Path.Combine(_appConfig.WorkingDir, "renderings", $"{hash}.png");

        private string GetCoverFqfn(Guid blueprintId) =>
            Path.Combine(_appConfig.WorkingDir, "covers", blueprintId.ToString());
    }
}
