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
using System.Threading.Tasks;

namespace FactorioTech.Core.Services
{
    public class ImageService
    {
        public enum RenderingType
        {
            Full,
            Thumb
        }

        private readonly ILogger<ImageService> _logger;
        private readonly AppDbContext _dbContext;
        private readonly AppConfig _appConfig;
        private readonly FbsrClient _fbsrClient;

        public ImageService(
            ILogger<ImageService> logger,
            IOptions<AppConfig> appConfigMonitor,
            AppDbContext dbContext,
            FbsrClient fbsrClient)
        {
            _logger = logger;
            _dbContext = dbContext;
            _appConfig = appConfigMonitor.Value;
            _fbsrClient = fbsrClient;
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

        public async Task<Stream?> TryLoadRendering(Hash hash, RenderingType type)
        {
            Stream? TryLoadIfExists()
            {
                var fqfn = GetRenderingFqfn(hash, type);

                try
                {
                    return File.Exists(fqfn) ? new FileStream(fqfn, FileMode.Open, FileAccess.Read) : null;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to read blueprint rendering {Type} for {Hash}", type, hash);
                    return null;
                }
            }

            var image = TryLoadIfExists();
            if (image != null)
                return image;

            switch (type)
            {
                case RenderingType.Full:
                    var payload = await _dbContext.BlueprintPayloads.AsNoTracking()
                        .FirstOrDefaultAsync(x => x.Hash == hash);
                    if (payload == null)
                        return null;

                    await SaveRenderingFull(payload);
                    break;

                case RenderingType.Thumb:
                    var rendering = await TryLoadRendering(hash, RenderingType.Full);
                    if (rendering == null)
                        return null;

                    await SaveRenderingThumb(hash, rendering);
                    break;
            }

            return TryLoadIfExists();
        }

        public async Task SaveRenderingFull(BlueprintPayload payload)
        {
            var imageFqfn = GetRenderingFqfn(payload.Hash, RenderingType.Full);
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

        public async Task SaveRenderingThumb(Hash hash, Stream rendering)
        {
            var (image, format) = await Image.LoadWithFormatAsync(rendering);
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(AppConfig.Cover.Width, AppConfig.Cover.Width),
                Mode = ResizeMode.Max,
            }));

            var imageFqfn = GetRenderingFqfn(hash, RenderingType.Thumb);

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
                _logger.LogError(ex, "Failed to fetch or save blueprint rendering {Type} for {Hash}", RenderingType.Thumb, hash);

                if (File.Exists(imageFqfn))
                {
                    File.Delete(imageFqfn);
                    _logger.LogWarning("Found and deleted existing blueprint rendering {Type} for failed {Hash}", RenderingType.Thumb, hash);
                }
            }
        }

        public async Task SaveCroppedCover(Guid blueprintId, Guid versionId, Hash hash, (int X, int Y, int Width, int Height)? rectangle = null)
        {
            var rendering = await TryLoadRendering(hash, RenderingType.Full);
            if (rendering == null)
            {
                _logger.LogCritical("Failed to load rendering for version {VersionId} with hash {Hash} to create blueprint image",
                    versionId, hash);
            }
            else
            {
                await SaveCroppedCover(blueprintId, rendering, rectangle);
            }
        }

        public async Task SaveCroppedCover(Guid blueprintId, Stream stream, (int X, int Y, int Width, int Height)? rectangle = null)
        {
            var (image, format) = await Image.LoadWithFormatAsync(stream);

            image.Mutate(x => x
                .Crop(rectangle.HasValue
                    ? new Rectangle(rectangle.Value.X, rectangle.Value.Y, rectangle.Value.Width, rectangle.Value.Height)
                    : new Rectangle(0, 0, Math.Min(image.Height, image.Width), Math.Min(image.Height, image.Width)))
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

        private string GetRenderingFqfn(Hash hash, RenderingType type) =>
            Path.Combine(_appConfig.DataDir, "renderings", $"{hash}-{type}.png");

        private string GetCoverFqfn(Guid blueprintId) =>
            Path.Combine(_appConfig.DataDir, "covers", blueprintId.ToString());
    }
}
