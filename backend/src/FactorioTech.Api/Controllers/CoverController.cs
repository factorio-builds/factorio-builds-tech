using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace FactorioTech.Api.Controllers
{
    [ApiController]
    [Route("covers")]
    public class CoverController : ControllerBase
    {
        private const int OneMonthInSeconds = 2629800;

        private readonly ImageService _imageService;

        public CoverController(ImageService imageService)
        {
            _imageService = imageService;
        }

        /// <summary>
        /// Get the cover image of a build
        /// </summary>
        /// <param name="fileName" example="V1StGXR8oZ5jdHi6BxmyT">The file name of the desired cover image</param>
        /// <response code="200" type="image/*">The cover image of the requested build</response>
        /// <response code="404" type="application/json">The requested build does not exist</response>
        [HttpGet("{fileName}")]
        [ProducesResponseType(typeof(byte[]), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ResponseCache(Duration = OneMonthInSeconds, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetCover([Required]string fileName)
        {
            var (file, format) = await _imageService.TryLoadCover(fileName);
            if (file == null)
                return NotFound();

            return File(file, format);
        }
    }
}
