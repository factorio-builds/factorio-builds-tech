using FactorioTech.Api.ViewModels;
using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics;
using System.Linq;
using System.Net.Mime;
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
        private readonly BlueprintConverter _blueprintConverter;
        private readonly ImageService _imageService;

        public PayloadController(
            ILogger<PayloadController> logger,
            AppDbContext dbContext,
            BlueprintConverter blueprintConverter,
            ImageService imageService)
        {
            _logger = logger;
            _dbContext = dbContext;
            _blueprintConverter = blueprintConverter;
            _imageService = imageService;
        }

        /// <summary>
        /// Get payload details
        /// </summary>
        /// <param name="hash" example="deab61eafb24af64f133cce738dfbabd">The hash of the desired payload</param>
        /// <param name="includeChildren">Specify whether to load the entire graph with all children or only the requested payload</param>
        /// <response code="200" type="application/json">The details of the requested payload</response>
        /// <response code="400" type="application/json">The request is malformed or invalid</response>
        /// <response code="404" type="application/json">The requested payload does not exist</response>
        [HttpGet("{hash}")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(ThinPayloadModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FullPayloadModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetDetails(Hash hash, [FromQuery(Name = "include_children")]bool includeChildren = false)
        {
            var payload = await _dbContext.BlueprintPayloads.AsNoTracking()
                .Where(v => v.Hash == hash)
                .FirstOrDefaultAsync();

            if (payload == null)
                return NotFound();

            var envelope = await _blueprintConverter.Decode(payload.Encoded);

            PayloadCache? payloadGraph = null;

            if (includeChildren)
            {
                payloadGraph = new PayloadCache();
                payloadGraph.TryAdd(envelope, payload);
                await payloadGraph.EnsureInitializedGraph(envelope);
            }

            return Ok(payload.ToViewModel(Url, envelope, payloadGraph));
        }

        /// <summary>
        /// Get the raw encoded blueprint string for import in the game or other tools
        /// </summary>
        /// <param name="hash" example="deab61eafb24af64f133cce738dfbabd">The hash of the desired payload</param>
        /// <response code="200" type="text/html">The raw encoded blueprint string</response>
        /// <response code="400" type="application/json">The request is malformed or invalid</response>
        /// <response code="404" type="application/json">The requested payload does not exist</response>
        [HttpGet("{hash}/raw")]
        [Produces(MediaTypeNames.Text.Plain)]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ResponseCache(Duration = OneMonthInSeconds, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetRaw(Hash hash)
        {
            var encoded = await _dbContext.BlueprintPayloads.AsNoTracking()
                .Where(v => v.Hash == hash)
                .Select(v => v.Encoded)
                .FirstOrDefaultAsync();

            if (encoded == null)
                return NotFound();

            return Ok(encoded);
        }

        /// <summary>
        /// Get the rendering for this payload in the specified type
        /// </summary>
        /// <param name="hash" example="deab61eafb24af64f133cce738dfbabd">The hash of the desired payload</param>
        /// <param name="type" example="Full">The desired type</param>
        /// <response code="200" type="image/png">The rendered blueprint image</response>
        /// <response code="400" type="application/json">The request is malformed or invalid</response>
        /// <response code="404" type="application/json">The requested payload does not exist</response>
        [HttpGet("{hash}/rendering/{type}")]
        [Produces("image/png")]
        [ProducesResponseType(typeof(byte[]), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ResponseCache(Duration = OneMonthInSeconds, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetBlueprintRendering(Hash hash, ImageService.RenderingType type)
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
    }
}
