using FactorioTech.Core;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace FactorioTech.Web.Controllers
{
    [ApiController]
    [Route("files")]
    public class FileController : ControllerBase
    {
        private const int OneDayInSeconds = 86400;
        private const int OneMonthInSeconds = 2629800;
        private static readonly TimeSpan NewBlueprintRenderingLoadInterval = TimeSpan.FromSeconds(2);
        private static readonly TimeSpan NewBlueprintRenderingLoadTimeout = TimeSpan.FromSeconds(30);

        private readonly ILogger<FileController> _logger;
        private readonly ImageService _imageService;
        private readonly AssetService _assetService;

        public FileController(
            ILogger<FileController> logger,
            ImageService imageService,
            AssetService assetService)
        {
            _logger = logger;
            _imageService = imageService;
            _assetService = assetService;
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

        [HttpGet("rendering/{type}/{hash}.png")]
        [ResponseCache(Duration = OneMonthInSeconds, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetBlueprintRendering(ImageService.RenderingType type, Hash hash)
        {
            var sw = Stopwatch.StartNew();

            do
            {
                var file = await _imageService.TryLoadRendering(hash, type);
                if (file != null)
                    return File(file, "image/png");

                _logger.LogWarning("Rendering {Type} for {Hash} not found; will retry.", type, hash);
                await Task.Delay(NewBlueprintRenderingLoadInterval);
            }
            while (sw.Elapsed < NewBlueprintRenderingLoadTimeout);

            _logger.LogWarning("Rendering {Type} for {Hash} not found; giving up.", type, hash);
            return NotFound();
        }

        [HttpGet("icon/{size}/{type}/{key}.png")]
        [ResponseCache(Duration = OneMonthInSeconds, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetGameIcon(AssetService.IconSize size, AssetService.IconType type, string key)
        {
            var icon = await _assetService.GetGameIcon(size, type, key);
            if (icon == null)
                return NotFound();

            return File(icon, "image/png");
        }
    }
}
