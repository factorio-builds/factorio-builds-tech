using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Core.Services;

[AutoConstructor]
public partial class ImageService
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

    private readonly ILogger<ImageService> logger;
    private readonly AppDbContext dbContext;
    private readonly FbsrClient fbsrClient;
    private readonly BlobServiceClient blobServiceClient;

    public async Task<BlobClient?> GetCover(string imageId)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(AppConfig.StorageContainers.Data);
        var blobClient = containerClient.GetBlobClient(GetCoverBlobPath(imageId));
        if (await blobClient.ExistsAsync())
            return blobClient;

        return null;
    }

    public async Task<BlobClient?> GetOrCreateRendering(Hash hash)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(AppConfig.StorageContainers.Data);
        var blobClient = containerClient.GetBlobClient(GetRenderingBlobPath(hash));
        if (await blobClient.ExistsAsync())
            return blobClient;

        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

        var payload = await dbContext.Payloads.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Hash == hash);

        if (payload == null)
        {
            logger.LogWarning("Payload for {Hash} not found", hash);
            return null;
        }

        return await SaveRendering(blobClient, payload);
    }

    private async Task<BlobClient?> SaveRendering(BlobClient blobClient, Payload payload)
    {
        if (payload.Type != PayloadType.Blueprint)
        {
            logger.LogWarning("Tried to create a rendering for {Hash}, but the payload is not blueprint: {Type}",
                payload.Hash, payload.Type);
            return null;
        }

        logger.LogInformation("Creating rendering for {Hash}", payload.Hash);

        if (await blobClient.ExistsAsync())
        {
            logger.LogWarning("Attempted to save new blueprint rendering with hash {Hash}, but the file already exists at {BlobUri}",
                payload.Hash, blobClient.Uri);
            return blobClient;
        }

        try
        {
            await using var imageData = await fbsrClient.FetchRendering(payload.Encoded);
            using var image = await Image.LoadAsync(imageData);
            using var processedImage = new MemoryStream();

            // quantize to 8bit to reduce size by about 50% (this is lossy but worth it)
            await image.SaveAsPngAsync(processedImage, new PngEncoder
            {
                ColorType = PngColorType.Palette,
                CompressionLevel = PngCompressionLevel.BestCompression,
                IgnoreMetadata = true,
            });

            processedImage.Position = 0;
            await blobClient.UploadAsync(processedImage, new BlobHttpHeaders
            {
                ContentType = "image/png",
            });

            var fileSize = processedImage.Length;
            if (fileSize == 0)
                throw new Exception($"Wrote 0 bytes to for {payload.Hash}");

            logger.LogInformation("Saved rendering for {Hash}: {Width}x{Height} - {FileSize} bytes",
                payload.Hash, image.Width, image.Height, fileSize);

            return blobClient;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to fetch or save blueprint rendering for {Hash}", payload.Hash);
            return null;
        }
    }

    public async Task DeleteRendering(Hash hash)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(AppConfig.StorageContainers.Data);
        var blobClient = containerClient.GetBlobClient(GetRenderingBlobPath(hash));
        if (await blobClient.DeleteIfExistsAsync())
        {
            logger.LogInformation("Deleted rendering for {Hash}", hash);
        }
    }

    public async Task<ITempCoverHandle> SaveCroppedCover(Hash hash, CropRectangle? crop = null)
    {
        var rendering = await GetOrCreateRendering(hash);
        if (rendering == null)
        {
            throw new Exception($"Failed to load rendering with hash {hash} to create blueprint image");
        }
        else
        {
            return await SaveCroppedCover(await rendering.OpenReadAsync(), crop);
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
        var containerClient = blobServiceClient.GetBlobContainerClient(AppConfig.StorageContainers.Data);
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

        var blobClient = containerClient.GetBlobClient(GetCoverBlobPath(imageId));

        using var processedImage = new MemoryStream();
        await image.SaveAsync(processedImage, format);

        processedImage.Position = 0;
        await blobClient.UploadAsync(processedImage, new BlobHttpHeaders
        {
            ContentType = format.DefaultMimeType,
        });

        var meta = new ImageMeta(imageId, image.Width, image.Height, processedImage.Length);
        return new TempCoverHandle(meta, containerClient, logger);
    }

    public static string GetRenderingBlobPath(Hash hash) => $"renderings/{hash}";

    public static string GetCoverBlobPath(string imageId) => $"covers/{imageId}";
}
