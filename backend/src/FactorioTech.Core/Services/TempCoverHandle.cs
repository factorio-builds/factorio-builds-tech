using FactorioTech.Core.Domain;
using Microsoft.Extensions.Logging;
using System;
using System.IO;

namespace FactorioTech.Core.Services
{
    public interface ITempCoverHandle : IDisposable
    {
        public ImageMeta? Meta { get; }
        public void Assign(Guid buildId);
    }

    public sealed class TempCoverHandle : ITempCoverHandle
    {
        public ImageMeta Meta { get; }

        private readonly ILogger<ImageService> _logger;
        private readonly Func<Guid, string> _getCoverFqfn;
        private readonly Guid _tempId;

        public TempCoverHandle(
            ILogger<ImageService> logger,
            Func<Guid, string> getCoverFqfn,
            Guid tempId,
            ImageMeta meta)
        {
            _getCoverFqfn = getCoverFqfn;
            _logger = logger;
            _tempId = tempId;
            Meta = meta;
        }

        public void Assign(Guid buildId) =>
            File.Move(_getCoverFqfn(_tempId), _getCoverFqfn(buildId), true);

        public void Dispose()
        {
            try
            {
                File.Delete(_getCoverFqfn(_tempId));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete temporary cover {Id}", _tempId);
            }
        }
    }

    public sealed class NullTempCoverHandle : ITempCoverHandle
    {
        public Guid TempId => Guid.Empty;

        public ImageMeta? Meta => null;

        public void Assign(Guid buildId) { }
        public void Dispose() { }
    }
}
