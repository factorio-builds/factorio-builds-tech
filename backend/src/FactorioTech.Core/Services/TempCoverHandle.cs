using Microsoft.Extensions.Logging;
using System;
using System.IO;

namespace FactorioTech.Core.Services
{
    public interface ITempCoverHandle : IDisposable
    {
        public Guid TempId { get; }
        public void Assign(Guid blueprintId);
    }

    public sealed class TempCoverHandle : ITempCoverHandle
    {
        public Guid TempId { get; } = Guid.NewGuid();

        private readonly ILogger<ImageService> _logger;
        private readonly Func<Guid, string> _getCoverFqfn;

        public TempCoverHandle(
            ILogger<ImageService> logger,
            Func<Guid, string> getCoverFqfn)
        {
            _getCoverFqfn = getCoverFqfn;
            _logger = logger;
        }

        public void Assign(Guid blueprintId) =>
            File.Move(_getCoverFqfn(TempId), _getCoverFqfn(blueprintId));

        public void Dispose()
        {
            try
            {
                File.Delete(_getCoverFqfn(TempId));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete temporary cover {Id}", TempId);
            }
        }
    }

    public sealed class NullTempCoverHandle : ITempCoverHandle
    {
        public Guid TempId => Guid.Empty;
        public void Assign(Guid blueprintId) { }
        public void Dispose() { }
    }
}
