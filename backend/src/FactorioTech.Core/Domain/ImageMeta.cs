using Microsoft.EntityFrameworkCore;

namespace FactorioTech.Core.Domain
{
    [Owned]
    public class ImageMeta
    {
        public int Width { get; init; }
        public int Height { get; init; }
        public long Size { get; init; }
        public string Format { get; init; } = null!;
    }
}
