using FactorioTech.Core;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FactorioTech.Api.Controllers
{
    [ApiController]
    [Route("assets")]
    public class AssetController : ControllerBase
    {
        private const int OneMonthInSeconds = 2629800;

        private readonly AssetService _assetService;

        public AssetController(AssetService assetService) => _assetService = assetService;

        /// <summary>
        /// Get a Factorio game icon
        /// </summary>
        /// <param name="size">The desired size. Valid values are `64`, `32`, `16` and `8`</param>
        /// <param name="type">The icon type. Valid values are `item` and `virtual`</param>
        /// <param name="key">The item's or signal's name</param>
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
