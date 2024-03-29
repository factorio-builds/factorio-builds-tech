using FactorioTech.Api.Services;
using FactorioTech.Api.ViewModels;
using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SluggyUnidecode;
using System.ComponentModel.DataAnnotations;
using System.Net.Mime;

namespace FactorioTech.Api.Controllers;

[ApiController]
[AutoConstructor]
[Route("payloads")]
public partial class PayloadController : ControllerBase
{
    private const int OneMonthInSeconds = 2629800;

    private readonly AppDbContext dbContext;
    private readonly ImageService imageService;
    private readonly BuildService buildService;
    private readonly BlueprintConverter blueprintConverter;
    private readonly SlugService slugService;

    /// <summary>
    ///     Get payload details
    /// </summary>
    /// <param name="hash" example="f8283ab0085a7e31c0ad3c43db36ae87">The hash of the desired payload</param>
    /// <param name="includeChildren">Specify whether to load the entire graph with all children or only the requested payload</param>
    /// <response code="200" type="application/json">The details of the requested payload</response>
    /// <response code="400" type="application/json">The request is malformed or invalid</response>
    /// <response code="404" type="application/json">The requested payload does not exist</response>
    [HttpGet("{hash}")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(PayloadModelBase), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDetails(
        [Required] Hash hash,
        [FromQuery(Name = "include_children")] bool includeChildren = false)
    {
        var payload = await dbContext.Payloads.AsNoTracking()
            .Where(v => v.Hash == hash)
            .FirstOrDefaultAsync();

        if (payload == null)
            return NotFound();

        var envelope = await blueprintConverter.Decode(payload.Encoded);

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
    ///     Get the raw encoded blueprint string for import in the game or other tools
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
    public async Task<IActionResult> GetRaw([Required] Hash hash)
    {
        var encoded = await dbContext.Payloads.AsNoTracking()
            .Where(v => v.Hash == hash)
            .Select(v => v.Encoded)
            .FirstOrDefaultAsync();

        if (encoded == null)
            return NotFound();

        return Ok(encoded);
    }

    /// <summary>
    ///     Get the decoded json body of a blueprint
    /// </summary>
    /// <param name="hash" example="f8283ab0085a7e31c0ad3c43db36ae87">The hash of the desired payload</param>
    /// <response code="200" type="application/json">The decoded json body</response>
    /// <response code="400" type="application/json">The request is malformed or invalid</response>
    /// <response code="404" type="application/json">The requested payload does not exist</response>
    [HttpGet("{hash}/json")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ResponseCache(Duration = OneMonthInSeconds, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> GetJson([Required] Hash hash)
    {
        var encoded = await dbContext.Payloads.AsNoTracking()
            .Where(v => v.Hash == hash)
            .Select(v => v.Encoded)
            .FirstOrDefaultAsync();

        if (encoded == null)
            return NotFound();

        var envelope = await blueprintConverter.Decode(encoded);
        return Ok(envelope);
    }

    /// <summary>
    ///     Delete the renderings of all types for this payload
    /// </summary>
    /// <param name="hash" example="f8283ab0085a7e31c0ad3c43db36ae87">The hash of the desired payload</param>
    /// <response code="204">The renderings have been deleted or do not exist</response>
    [Authorize(Roles = Role.Administrator)]
    [HttpDelete("{hash}/rendering")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteRendering([Required] Hash hash)
    {
        await imageService.DeleteRendering(hash);
        return NoContent();
    }

    /// <summary>
    ///     Create a payload for the encoded blueprint string. If the blueprint is a `blueprint-book`,
    ///     payloads for all children will be created too.
    /// </summary>
    [Authorize]
    [HttpPut("")]
    [Produces(MediaTypeNames.Application.Json)]
    [Consumes(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(CreatePayloadResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreatePayload(
        [FromBody] [Required] CreatePayloadRequest request)
    {
        var envelope = await blueprintConverter.Decode(request.Encoded);

        var firstBlueprint = FirstBlueprintOrDefault(envelope);
        if (firstBlueprint == null)
            return BadRequest("A blueprint book must contain at least one blueprint");

        var hash = Hash.Compute(request.Encoded);
        var payload = new Payload(
            hash,
            blueprintConverter.ParseType(envelope.Entity.Item),
            blueprintConverter.DecodeGameVersion(envelope.Entity.Version),
            request.Encoded);

        var cache = new PayloadCache();
        cache.TryAdd(envelope, payload);

        await cache.EnsureInitializedGraph(envelope);
        await buildService.SavePayloadGraph(hash, cache.Values);

        return Ok(new CreatePayloadResult
        {
            Payload = payload.ToViewModel(Url, envelope, cache),
            ExtractedSlug =
                await slugService.Validate(TryValidateModel, envelope.Entity.Label?.ToSlug(), User.GetUserId()),
        });
    }

    private static FactorioApi.Blueprint? FirstBlueprintOrDefault(FactorioApi.BlueprintEnvelope? envelope)
    {
        if (envelope == null)
            return null;

        return envelope.Blueprint ?? FirstBlueprintOrDefault(envelope.BlueprintBook?.Blueprints?.FirstOrDefault());
    }

    public sealed class CreatePayloadRequest
    {
        /// <summary>
        ///     The encoded blueprint string.
        /// </summary>
        /// <example>0eNqllMtugzAQRX8FzRqiQszLyyy77bKqKh6jaiTbWLapghD/XhOkNEpJ04adx56553r8GKEWPWpDygEfoUXbGNKOOgUcnnvrgiqwJLXA4Jy4gxCo6ZQF/jqCpQ9VibnYDRp9FTmUPkNVco7wqA1aGzlTKas746IahYPJS6gWj8DjKbwrYjW1aJzxrr4Lk+ktBFSOHOFi5RQM76qXNRqvfM9ECLqztGx2hNlLud+lIQzAi3nkWS0ZbJaMZDZ6hUgeQCT/Q+wfQLDbCLaCYGeExJZ6GaHw6YaaSHcCf2+TR00rkummxqTrotmmA02vW5GtIPJNvm80o9h0hH/yXW5CsJ+3xL+t0xvkFx9ECKLyYn7uZfkSDhdLn2jscomLmOWszLM8fsrSbJq+AEDWdWo=</example>
        [Required]
        [RegularExpression(AppConfig.Policies.BlueprintString.AllowedCharactersRegex)]
        public string Encoded { get; set; } = null!;
    }

    public sealed class CreatePayloadResult
    {
        /// <summary>
        ///     The full payload graph that was created in this operation.
        /// </summary>
        [Required]
        public PayloadModelBase Payload { get; set; } = null!;

        /// <summary>
        ///     The primary blueprint's title (aka label) converted to slug,
        ///     including fields indicating whether the slug is valid and available for the authenticated user.
        /// </summary>
        [Required]
        public SlugService.SlugValidationResult ExtractedSlug { get; set; } =
            SlugService.SlugValidationResult.Invalid(string.Empty);
    }
}
