using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FactorioTech.Core
{
    public class AssetService
    {

        public enum IconType
        {
            Item,
            Virtual,
        }

        public enum IconSize
        {
            Square64 = 64,
            Square32 = 32,
            Square16 = 16,
            Square8 = 8,
        }

        private readonly AppConfig _appConfig;

        public AssetService(IOptions<AppConfig> appConfigMonitor) => _appConfig = appConfigMonitor.Value;

        public async Task<Stream?> GetGameIcon(IconSize size, IconType type, string key)
        {
            var sanitized = Regex.Replace(key, "[^a-zA-Z0-9_-]+", string.Empty, RegexOptions.Compiled)
                switch
                {
                    "heat-exchanger" => "heat-boiler",
                    "stone-wall" => "wall",
                    "straight-rail" => "rail",
                    { } s => s,
                };

            var fileName = type switch
            {
                IconType.Item => $"{sanitized}.png",
                IconType.Virtual => Path.Combine("signal", $"{sanitized.Replace("-", "_")}.png"),
                _ => throw new ArgumentOutOfRangeException(nameof(type))
            };

            var fqfn = Path.Combine(_appConfig.FactorioDir, "data", "base", "graphics", "icons", fileName);
            if (!File.Exists(fqfn))
                return null;

            using var image = await Image.LoadAsync(fqfn);

            var cropRectangle = size switch
            {
                IconSize.Square64 => new Rectangle(0, 0, 64, 64),
                IconSize.Square32 => new Rectangle(64, 0, 32, 32),
                IconSize.Square16 => new Rectangle(64 + 32, 0, 16, 16),
                IconSize.Square8 => new Rectangle(64 + 32 + 16, 0, 8, 8),
                _ => throw new ArgumentOutOfRangeException(nameof(size))
            };

            image.Mutate(x => x.Crop(cropRectangle));

            var output = new MemoryStream();
            await image.SaveAsPngAsync(output);
            output.Seek(0, SeekOrigin.Begin);

            return output;
        }
    }
}
