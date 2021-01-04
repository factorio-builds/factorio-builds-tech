using FactorioTech.Api.Extensions;
using FactorioTech.Api.ViewModels;
using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        private readonly ImageService _imageService;
        private readonly BlueprintService _blueprintService;
        private readonly BlueprintConverter _blueprintConverter;

        public PayloadController(
            ILogger<PayloadController> logger,
            AppDbContext dbContext,
            ImageService imageService,
            BlueprintService blueprintService,
            BlueprintConverter blueprintConverter)
        {
            _logger = logger;
            _dbContext = dbContext;
            _imageService = imageService;
            _blueprintService = blueprintService;
            _blueprintConverter = blueprintConverter;
        }

        /// <summary>
        /// Get payload details
        /// </summary>
        /// <param name="hash" example="f8283ab0085a7e31c0ad3c43db36ae87">The hash of the desired payload</param>
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
        /// <param name="hash" example="f8283ab0085a7e31c0ad3c43db36ae87">The hash of the desired payload</param>
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
        /// <param name="hash" example="f8283ab0085a7e31c0ad3c43db36ae87">The hash of the desired payload</param>
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

                _logger.LogWarning("Rendering {Type} for {Hash} not found; will retry in {Interval}", type, hash, NewBlueprintRenderingLoadInterval);
                await Task.Delay(NewBlueprintRenderingLoadInterval);
            }
            while (sw.Elapsed < NewBlueprintRenderingLoadTimeout);

            _logger.LogWarning("Rendering {Type} for {Hash} not found after {Timeout}; giving up", type, hash, NewBlueprintRenderingLoadTimeout);
            return NotFound();
        }

        /// <summary>
        /// Create a payload for the encoded blueprint string. If the blueprint is a `blueprint-book`,
        /// payloads for all children will be created too.
        /// </summary>
        [Authorize]
        [HttpPut("")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(CreatePayloadResult), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreatePayload([FromBody]CreatePayloadRequest request)
        {
            var envelope = await _blueprintConverter.Decode(request.Encoded);

            var firstBlueprint = FirstBlueprintOrDefault(envelope);
            if (firstBlueprint == null)
                return BadRequest("A blueprint book must contain at least one blueprint");

            var hash = Hash.Compute(request.Encoded);
            var payload = new BlueprintPayload(
                hash,
                _blueprintConverter.ParseType(envelope.Item),
                _blueprintConverter.DecodeGameVersion(envelope.Version),
                request.Encoded);

            var cache = new PayloadCache();
            cache.TryAdd(envelope, payload);

            await cache.EnsureInitializedGraph(envelope);
            await _blueprintService.SavePayloadGraph(hash, cache.Values);

            return Ok(new CreatePayloadResult
            {
                Hash = hash,
                AllHashes = new HashSet<Hash>(cache.Values.Select(x => x.Hash)),
                ExtractedTags = new HashSet<string>(GetSomeRandomTags()),
            });
        }

        private FactorioApi.Blueprint? FirstBlueprintOrDefault(FactorioApi.BlueprintEnvelope? envelope)
        {
            if (envelope == null)
                return null;

            return envelope.Blueprint ?? FirstBlueprintOrDefault(envelope.BlueprintBook?.Blueprints?.FirstOrDefault());
        }

        private static IEnumerable<string> GetSomeRandomTags()
        {
            // todo: implement @veksen's heuristics
            var count = Tags.All.Count();
            var rnd = new Random();
            return Enumerable.Range(0, rnd.Next(2, 5))
                .Select(_ => Tags.All.ElementAt(rnd.Next(0, count - 1)));
        }

        public class CreatePayloadRequest
        {
            /// <summary>
            /// The encoded blueprint string.
            /// </summary>
            /// <example>0eNqllMtugzAQRX8FzRqiQszLyyy77bKqKh6jaiTbWLapghD/XhOkNEpJ04adx56553r8GKEWPWpDygEfoUXbGNKOOgUcnnvrgiqwJLXA4Jy4gxCo6ZQF/jqCpQ9VibnYDRp9FTmUPkNVco7wqA1aGzlTKas746IahYPJS6gWj8DjKbwrYjW1aJzxrr4Lk+ktBFSOHOFi5RQM76qXNRqvfM9ECLqztGx2hNlLud+lIQzAi3nkWS0ZbJaMZDZ6hUgeQCT/Q+wfQLDbCLaCYGeExJZ6GaHw6YaaSHcCf2+TR00rkummxqTrotmmA02vW5GtIPJNvm80o9h0hH/yXW5CsJ+3xL+t0xvkFx9ECKLyYn7uZfkSDhdLn2jscomLmOWszLM8fsrSbJq+AEDWdWo=</example>
            [Required]
            [RegularExpression(AppConfig.Policies.BlueprintString.AllowedCharactersRegex)]
            public string Encoded { get; set; } = null!;
        }

        public class CreatePayloadResult
        {
            /// <summary>
            /// The hash of the primary (or parent) payload that was created.
            /// </summary>
            /// <example>f8283ab0085a7e31c0ad3c43db36ae87</example>
            [Required]
            public Hash Hash { get; set; }

            /// <summary>
            /// The hashes of all payloads that were created in this operation.
            /// </summary>
            [Required]
            public IEnumerable<Hash> AllHashes { get; set; } = Enumerable.Empty<Hash>();

            /// <summary>
            /// The tags that have been extracted for this payload.
            /// </summary>
            [Required]
            public IEnumerable<string> ExtractedTags { get; set; } = Enumerable.Empty<string>();
        }
    }
}
