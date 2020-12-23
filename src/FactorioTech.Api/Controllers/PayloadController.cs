using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Api.Controllers
{
    [Route("payloads")]
    [ApiController]
    public class PayloadController : ControllerBase
    {
        private const int OneMonthInSeconds = 2629800;
        private static readonly TimeSpan NewBlueprintRenderingLoadInterval = TimeSpan.FromSeconds(2);
        private static readonly TimeSpan NewBlueprintRenderingLoadTimeout = TimeSpan.FromSeconds(30);

        private readonly ILogger<PayloadController> _logger;
        private readonly AppDbContext _dbContext;
        private readonly ImageService _imageService;

        public PayloadController(
            ILogger<PayloadController> logger,
            AppDbContext dbContext,
            ImageService imageService)
        {
            _logger = logger;
            _dbContext = dbContext;
            _imageService = imageService;
        }

        /// <summary>
        /// Get payload details
        /// </summary>
        [HttpGet("{hash}")]
        public async Task<IActionResult> GetDetails(string hash)
        {
            var payload = await _dbContext.BlueprintPayloads.AsNoTracking()
                .Where(v => v.Hash == new Hash(hash))
                .FirstOrDefaultAsync();

            if (payload == null)
                return NotFound();

            return Ok(payload.ToViewModel());
        }

        /// <summary>
        /// Get the raw encoded blueprint string for import in the game or other tools
        /// </summary>
        [HttpGet("{hash}/raw")]
        [ResponseCache(Duration = OneMonthInSeconds, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetRaw(string hash)
        {
            var encoded = await _dbContext.BlueprintPayloads.AsNoTracking()
                .Where(v => v.Hash == new Hash(hash))
                .Select(v => v.Encoded)
                .FirstOrDefaultAsync();

            if (encoded == null)
                return NotFound();

            return Ok(encoded);
        }

        /// <summary>
        /// Get the rendering for this payload in the specified type
        /// </summary>
        [HttpGet("{hash}/rendering/{type}")]
        [ResponseCache(Duration = OneMonthInSeconds, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetBlueprintRendering(string hash, ImageService.RenderingType type)
        {
            var sw = Stopwatch.StartNew();

            do
            {
                var file = await _imageService.TryLoadRendering(new Hash(hash), type);
                if (file != null)
                    return File(file, "image/png");

                _logger.LogWarning("Rendering {Type} for {Hash} not found; will retry.", type, hash);
                await Task.Delay(NewBlueprintRenderingLoadInterval);
            }
            while (sw.Elapsed < NewBlueprintRenderingLoadTimeout);

            _logger.LogWarning("Rendering {Type} for {Hash} not found; giving up.", type, hash);
            return NotFound();
        }
    }
}
