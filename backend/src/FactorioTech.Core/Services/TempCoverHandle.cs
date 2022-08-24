using Azure.Storage.Blobs;
using FactorioTech.Core.Domain;
using Microsoft.Extensions.Logging;

namespace FactorioTech.Core.Services;

public interface ITempCoverHandle : IAsyncDisposable
{
    public ImageMeta Meta { get; }
    public ValueTask Assign(Guid buildId, ImageMeta? curreImageMeta);
}

[AutoConstructor]
public sealed partial class TempCoverHandle : ITempCoverHandle
{
    public ImageMeta Meta { get; }

    private readonly BlobContainerClient containerClient;
    private readonly ILogger<ImageService> logger;

    private bool isAssigned = false;

    public async ValueTask Assign(Guid buildId, ImageMeta? previousCover)
    {
        isAssigned = true;

        logger.LogInformation("Assigned uploaded cover to build {BuildId}: {ImageId}",
            buildId, Meta.ImageId);

        if (previousCover != null)
        {
            try
            {
                var blob = containerClient.GetBlobClient(ImageService.GetCoverBlobPath(previousCover.ImageId));
                await blob.DeleteAsync();
                logger.LogInformation("Deleted existing (previous) cover for build {BuildId}: {BlobUri}",
                    buildId, blob.Uri);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to delete existing (previous) cover for build {BuildId}: {ImageId}",
                    buildId, previousCover.ImageId);
            }
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (!isAssigned)
        {
            logger.LogWarning("Deleting uploaded cover image without assigning it to a build: {ImageId}", Meta.ImageId);

            try
            {
                var blob = containerClient.GetBlobClient(ImageService.GetCoverBlobPath(Meta.ImageId));
                await blob.DeleteAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to delete temporary cover {ImageId}", Meta.ImageId);
            }
        }
    }
}

public sealed class NullTempCoverHandle : ITempCoverHandle
{
    public ImageMeta Meta => new(string.Empty, 0, 0, 0);
    public ValueTask Assign(Guid buildId, ImageMeta? curreImageMeta) => ValueTask.CompletedTask;
    public ValueTask DisposeAsync() => ValueTask.CompletedTask;
}
