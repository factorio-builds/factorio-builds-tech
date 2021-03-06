using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;

namespace FactorioTech.Core.Services
{
    public class ImageService
    {
        public enum RenderingType
        {
            Full,
            Thumb,
        }

        public sealed class CropRectangle
        {
            [Required]
            [Range(0, int.MaxValue)]
            public int X { get; set; }

            [Required]
            [Range(0, int.MaxValue)]
            public int Y { get; set; }

            [Required]
            [Range(1, int.MaxValue)]
            public int Width { get; set; }

            [Required]
            [Range(1, int.MaxValue)]
            public int Height { get; set; }
        }

        private readonly ILogger<ImageService> _logger;
        private readonly AppDbContext _dbContext;
        private readonly AppConfig _appConfig;
        private readonly FbsrClient _fbsrClient;

        private static readonly TimeSpan NewRenderingLoadInterval = TimeSpan.FromSeconds(2);
        private static readonly TimeSpan NewRenderingLoadTimeout = TimeSpan.FromSeconds(30);

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

        public async Task<(Stream? File, string? MimeType)> TryLoadCover(Guid buildId)
        {
            var imageFqfn = GetCoverFqfn(buildId);
            if (!File.Exists(imageFqfn))
                return (null, null);

            var file = new FileStream(imageFqfn, FileMode.Open, FileAccess.Read);
            var format = await Image.DetectFormatAsync(file);

            return (file, format.DefaultMimeType);
        }

        public async Task<Stream?> TryLoadRendering(Hash hash, RenderingType type)
        {
            var sw = Stopwatch.StartNew();

            do
            {
                var image = await TryLoadRenderingInner(hash, type);
                if (image != null)
                    return image;

                _logger.LogWarning("Rendering {Type} for {Hash} not found; will retry in {Interval}", type, hash, NewRenderingLoadInterval);
                await Task.Delay(NewRenderingLoadInterval);
            }
            while (sw.Elapsed < NewRenderingLoadTimeout);

            _logger.LogWarning("Rendering {Type} for {Hash} not found after {Timeout}; giving up", type, hash, NewRenderingLoadTimeout);
            return null;
        }

        private async Task<Stream?> TryLoadRenderingInner(Hash hash, RenderingType type)
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
                    _logger.LogWarning(ex, "Failed to read rendering {Type} for {Hash}", type, hash);
                    return null;
                }
            }

            var image = TryLoadIfExists();
            if (image != null)
                return image;

            switch (type)
            {
                case RenderingType.Full:
                    var payload = await _dbContext.Payloads.AsNoTracking()
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

                default:
                    throw new ArgumentOutOfRangeException(nameof(type), type, null);
            }

            return TryLoadIfExists();
        }

        public async Task SaveRenderingFull(Payload payload)
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
                await using var imageData = await _fbsrClient.FetchRendering(payload.Encoded);
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

        public void DeleteRendering(Hash hash)
        {
            var types = new[] { RenderingType.Full, RenderingType.Thumb };
            foreach (var type in types)
            {
                var path = GetRenderingFqfn(hash, type);
                if (File.Exists(path))
                {
                    File.Delete(path);
                    _logger.LogInformation("Deleted rendering {Type} for {Hash}", type, hash);
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

            try
            {
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

        public async Task<ITempCoverHandle> SaveCroppedCover(Hash hash, CropRectangle? crop = null)
        {
            var rendering = await TryLoadRendering(hash, RenderingType.Full);
            if (rendering == null)
            {
                throw new Exception($"Failed to load rendering with hash {hash} to create blueprint image");
            }
            else
            {
                return await SaveCroppedCover(rendering, crop);
            }
        }

        public async Task<ITempCoverHandle> SaveCroppedCover(Stream stream, CropRectangle? crop = null)
        {
            var (image, format) = await Image.LoadWithFormatAsync(stream);

            var resize = new ResizeOptions
            {
                Size = new Size(AppConfig.Cover.Width, AppConfig.Cover.Width),
                Mode = ResizeMode.Max,
            };

            if (crop != null)
            {
                image.Mutate(x => x
                    .AutoOrient()
                    .Crop(new Rectangle(crop.X, crop.Y, crop.Width, crop.Height))
                    .Resize(resize));
            }
            else
            {
                image.Mutate(x => x
                    .AutoOrient()
                    .Resize(resize));
            }

            var tempId = Guid.NewGuid();
            var imageFqfn = GetCoverFqfn(tempId);
            var baseDir = Path.GetDirectoryName(imageFqfn);
            if (baseDir != null && !Directory.Exists(baseDir))
            {
                Directory.CreateDirectory(baseDir);
            }

            await using var outFile = new FileStream(imageFqfn, FileMode.OpenOrCreate, FileAccess.Write);
            await image.SaveAsync(outFile, format);

            var meta = new ImageMeta
            {
                Width = image.Width,
                Height = image.Height,
                Size = outFile.Length,
                Format = format.Name,
            };

            return new TempCoverHandle(_logger, GetCoverFqfn, tempId, meta);
        }

        private string GetRenderingFqfn(Hash hash, RenderingType type) =>
            Path.Combine(_appConfig.DataDir, "renderings", $"{hash}-{type}.png");

        private string GetCoverFqfn(Guid buildId) =>
            Path.Combine(_appConfig.DataDir, "covers", buildId.ToString());
    }
}
