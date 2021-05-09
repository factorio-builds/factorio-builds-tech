using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Core.Services
{
    public class ImageService
    {
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
        private readonly IFileProvider _fileProvider;
        private readonly AppDbContext _dbContext;
        private readonly AppConfig _appConfig;
        private readonly FbsrClient _fbsrClient;

        public ImageService(
            IOptions<AppConfig> appConfigMonitor,
            ILogger<ImageService> logger,
            IFileProvider fileProvider,
            AppDbContext dbContext,
            FbsrClient fbsrClient)
        {
            _appConfig = appConfigMonitor.Value;
            _logger = logger;
            _fileProvider = fileProvider;
            _dbContext = dbContext;
            _fbsrClient = fbsrClient;
        }

        public async Task<IFileInfo> GetOrCreateRendering(Hash hash)
        {
            var fileInfo = GetRenderingFileInfo(hash);
            if (fileInfo.Exists)
                return fileInfo;

            var payload = await _dbContext.Payloads.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Hash == hash);

            if (payload == null)
            {
                _logger.LogWarning("Payload for {Hash} not found", hash);
                return fileInfo;
            }

            await SaveRendering(payload);

            return GetRenderingFileInfo(hash);
        }

        public async Task SaveRendering(Payload payload)
        {
            if (payload.Type != PayloadType.Blueprint)
            {
                _logger.LogWarning("Tried to create a rendering for {Hash}, but the payload is not blueprint: {Type}",
                    payload.Hash, payload.Type);
                return;
            }

            _logger.LogInformation("Creating rendering for {Hash}", payload.Hash);

            var imageFqfn = GetRenderingFqfn(payload.Hash);
            if (File.Exists(imageFqfn))
            {
                _logger.LogWarning("Attempted to save new blueprint rendering with hash {Hash}, but the file already exists at {ImageFqfn}",
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

                _logger.LogInformation("Saved rendering for {Hash}: {Width}x{Height} - {FileSize} bytes",
                    payload.Hash, image.Width, image.Height, fileSize);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch or save blueprint rendering for {Hash}", payload.Hash);

                if (File.Exists(imageFqfn))
                {
                    File.Delete(imageFqfn);
                    _logger.LogWarning("Found and deleted existing blueprint rendering for failed {Hash}", payload.Hash);
                }
            }
        }

        public void DeleteRendering(Hash hash)
        {
            var path = GetRenderingFqfn(hash);
            if (File.Exists(path))
            {
                File.Delete(path);
                _logger.LogInformation("Deleted rendering for {Hash}", hash);
            }
        }

        public async Task<ITempCoverHandle> SaveCroppedCover(Hash hash, CropRectangle? crop = null)
        {
            var rendering = await GetOrCreateRendering(hash);
            if (!rendering.Exists)
            {
                throw new Exception($"Failed to load rendering with hash {hash} to create blueprint image");
            }
            else
            {
                return await SaveCroppedCover(rendering.CreateReadStream(), crop);
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

            var imageId = await Nanoid.Nanoid.GenerateAsync("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
            var fileName = $"{imageId}.{format.FileExtensions.First()}";
            var imageFqfn = GetCoverFqfn(fileName);
            var baseDir = Path.GetDirectoryName(imageFqfn);
            if (baseDir != null && !Directory.Exists(baseDir))
            {
                Directory.CreateDirectory(baseDir);
            }

            await using var outFile = new FileStream(imageFqfn, FileMode.OpenOrCreate, FileAccess.Write);
            await image.SaveAsync(outFile, format);

            var meta = new ImageMeta(fileName, image.Width,image.Height, outFile.Length);

            return new TempCoverHandle(_logger, GetCoverFqfn, meta);
        }

        private IFileInfo GetRenderingFileInfo(Hash hash) =>
            _fileProvider.GetFileInfo(Path.Combine("renderings", $"{hash}.png"));

        private string GetRenderingFqfn(Hash hash) =>
            Path.Combine(_appConfig.DataDir, "renderings", $"{hash}.png");

        private string GetCoverFqfn(string fileName) =>
            Path.Combine(_appConfig.DataDir, "covers", fileName);
    }
}
