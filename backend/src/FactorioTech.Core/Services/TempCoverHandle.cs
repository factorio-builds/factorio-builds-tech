using FactorioTech.Core.Domain;
using Microsoft.Extensions.Logging;
using System;
using System.IO;

namespace FactorioTech.Core.Services
{
    public interface ITempCoverHandle : IDisposable
    {
        public ImageMeta Meta { get; }
        public void Assign(Guid buildId, ImageMeta? curreImageMeta);
    }

    public sealed class TempCoverHandle : ITempCoverHandle
    {
        public ImageMeta Meta { get; }

        private readonly ILogger<ImageService> _logger;
        private readonly Func<string, string> _getCoverFqfn;
        private bool _isAssigned = false;

        public TempCoverHandle(
            ILogger<ImageService> logger,
            Func<string, string> getCoverFqfn,
            ImageMeta meta)
        {
            _getCoverFqfn = getCoverFqfn;
            _logger = logger;
            Meta = meta;
        }

        public void Assign(Guid buildId, ImageMeta? previousCover)
        {
            _isAssigned = true;

            _logger.LogInformation("Assigned uploaded cover to build {BuildId}: {Path}",
                buildId, _getCoverFqfn(Meta.FileName));

            if (previousCover != null)
            {
                var previousFqfn = _getCoverFqfn(previousCover.FileName);
                try
                {
                    File.Delete(previousFqfn);
                    _logger.LogInformation("Deleted existing (previous) cover for build {BuildId}: {Path}",
                        buildId, previousFqfn);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to delete existing (previous) cover for build {BuildId}: {Path}",
                        buildId, previousFqfn);
                }
            }
        }

        public void Dispose()
        {
            if (!_isAssigned)
            {
                var fqfn = _getCoverFqfn(Meta.FileName);
                _logger.LogWarning("Deleting uploaded cover image without assigning it to a build: {Path}", fqfn);

                try
                {
                    File.Delete(fqfn);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to delete temporary cover {Path}", fqfn);
                }
            }
        }
    }

    public sealed class NullTempCoverHandle : ITempCoverHandle
    {
        public ImageMeta Meta => new(string.Empty, 0, 0, 0);
        public void Assign(Guid buildId, ImageMeta? curreImageMeta) { }
        public void Dispose() { }
    }
}
