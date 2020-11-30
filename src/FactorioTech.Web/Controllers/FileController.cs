using FactorioTech.Core;
using FactorioTech.Core.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FactorioTech.Web.Controllers
{
    [ApiController]
    [Route("files")]
    public class FileController : ControllerBase
    {
        private const int OneDayInSeconds = 86400;
        private const int OneMonthInSeconds = 2629800;

        private readonly AppConfig _appConfig;
        private readonly ImageService _imageService;

        public FileController(
            IOptions<AppConfig> appConfigMonitor,
            ImageService imageService)
        {
            _appConfig = appConfigMonitor.Value;
            _imageService = imageService;
        }

        [HttpGet("cover/{blueprintId}")]
        [ResponseCache(Duration = OneDayInSeconds, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetBlueprintCover(Guid blueprintId)
        {
            var (file, format) = await _imageService.TryLoadCover(blueprintId);
            if (file == null)
                return NotFound();

            return File(file, format);
        }

        [HttpGet("rendering/{hash}.png")]
        [HttpGet("rendering/{versionId}/{hash}.png")]
        [ResponseCache(Duration = OneMonthInSeconds, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetBlueprintRendering(string hash, Guid? versionId = null)
        {
            var file = await _imageService.TryLoadRendering(versionId, new Hash(hash));
            if (file == null)
                return NotFound();

            return File(file, "image/png");
        }

        [HttpGet("icon/{size:int}/{type}/{key}.png")]
        [ResponseCache(Duration = OneMonthInSeconds, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetGameIcon(int size, string type, string key)
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
                "item" => $"{sanitized}.png",
                "virtual" => Path.Combine("signal", $"{sanitized.Replace("-", "_")}.png"),
                _ => null,
            };

            if (fileName == null)
                return BadRequest("Invalid type");

            var fqfn = Path.Combine(_appConfig.FactorioDir, "data", "base", "graphics", "icons", fileName);
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
