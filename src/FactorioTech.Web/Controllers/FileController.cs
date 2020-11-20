using FactorioTech.Web.Core;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FactorioTech.Web.Controllers
{
    [ApiController]
    [Route("api/files")]
    public class FileController : ControllerBase
    {
        private const int OneWeekInSeconds = 60 * 60 * 24 * 7;

        private static readonly Regex _sanitizer = new ("[^a-zA-Z0-9_-]+", RegexOptions.Compiled);

        private readonly ImageService _imageService;

        public FileController(ImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpGet("blueprint/{hash}.jpg")]
        [ResponseCache(Duration = OneWeekInSeconds, Location = ResponseCacheLocation.Client)]
        public IActionResult GetBlueprintRendering(string hash)
        {
            var file = _imageService.GetBlueprintRendering(hash);
            return new FileStreamResult(file, "image/jpeg");
        }

        [HttpGet("icon/{size:int}/{type}/{key}.png")]
        [ResponseCache(Duration = OneWeekInSeconds, Location = ResponseCacheLocation.Client)]
        public async Task<IActionResult> GetGameIcon(int size, string type, string key)
        {
            var sanitized = _sanitizer.Replace(key, string.Empty) switch
            {
                "heat-exchanger" => "heat-boiler",
                "stone-wall" => "wall",
                "straight-rail" => "rail",
                { } s => s,
            };

            var fileName = type switch
            {
                "item" => $"{sanitized}.png",
                "virtual" => Path.Combine("signal", $"{sanitized.Replace("-", "_")}.png"),
                _ => default,
            };
            
            if (fileName == default)
                return BadRequest("Invalid type");

            var fqfn = Path.Combine(AppConfig.FactorioDir, "data", "base", "graphics", "icons", fileName);
            if (!System.IO.File.Exists(fqfn))
                return NotFound();

            using var image = await Image.LoadAsync(fqfn);

            var cropRectangle = size switch
            {
                64 => new Rectangle(0, 0, 64, 64),
                32 => new Rectangle(64, 0, 32, 32),
                16 => new Rectangle(64 + 32, 0, 16, 16),
                8  => new Rectangle(64 + 32 + 16, 0, 8, 8),
                _  => default,
            };

            if (cropRectangle == default)
                return BadRequest("Invalid size");

            image.Mutate(x => x.Crop(cropRectangle));

            var output = new MemoryStream();
            await image.SaveAsPngAsync(output);
            output.Seek(0, SeekOrigin.Begin);

            return File(output, "image/png");
        }
    }
}
