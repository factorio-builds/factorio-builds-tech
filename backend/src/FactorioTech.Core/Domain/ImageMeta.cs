using Microsoft.EntityFrameworkCore;

namespace FactorioTech.Core.Domain
{
    [Owned]
    public class ImageMeta
    {
        public string FileName { get; init; }
        public int Width { get; init; }
        public int Height { get; init; }
        public long Size { get; init; }

        public ImageMeta(string fileName, int width, int height, long size)
        {
            FileName = fileName;
            Width = width;
            Height = height;
            Size = size;
        }

#pragma warning disable 8618 // required for EF
        private ImageMeta() { }
#pragma warning restore 8618
    }
}
