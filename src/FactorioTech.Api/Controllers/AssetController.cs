using FactorioTech.Core;
using Microsoft.AspNetCore.Http;
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
        /// <param name="size" example="64">The desired size. Valid values are `64`, `32`, `16` and `8`</param>
        /// <param name="type" example="item">The icon type</param>
        /// <param name="key" example="stone-wall">The item's or signal's name</param>
        /// <response code="200" type="image/png">The requested game icon</response>
        /// <response code="400" type="application/json">The request is malformed or invalid</response>
        /// <response code="404" type="application/json">The requested icon does not exist</response>
        [HttpGet("icon/{size}/{type}/{key}.png")]
        [Produces("image/png")]
        [ProducesResponseType(typeof(byte[]), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
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
