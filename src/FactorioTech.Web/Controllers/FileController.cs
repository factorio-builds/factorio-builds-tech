using FactorioTech.Web.Core;
using Microsoft.AspNetCore.Mvc;

namespace FactorioTech.Web.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private const int OneWeekInSeconds = 60 * 60 * 24 * 7;

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
    }
}
