using FactorioTech.Api.ViewModels;
using FactorioTech.Core;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net.Mime;
using System.Threading.Tasks;

namespace FactorioTech.Api.Controllers
{
    [Route("builds")]
    [ApiController]
    public class BuildController : ControllerBase
    {
        private const int PageSize = 100;
        private const int OneDayInSeconds = 86400;

        private readonly BlueprintService _blueprintService;
        private readonly ImageService _imageService;

        public BuildController(
            BlueprintService blueprintService,
            ImageService imageService)
        {
            _blueprintService = blueprintService;
            _imageService = imageService;
        }

        /// <summary>
        /// Get a paged, filtered and ordered list of builds
        /// </summary>
        /// <param name="currentPage">The desired page</param>
        /// <param name="sortField">The desired field to sort the results</param>
        /// <param name="sortDirection">The desired direction to sort the results</param>
        /// <param name="queryStr">An optional search term to filter the results by</param>
        /// <param name="tagsCsv">An optional comma-separated list of tags to filter the results by</param>
        /// <param name="version">An optional game version to filter the results by</param>
        /// <response code="200" type="application/json">The paged, filtered and ordered list of matching builds</response>
        /// <response code="400" type="application/json">The request is malformed or invalid</response>
        /// <response code="404" type="application/json">The requested build does not exist</response>
        [HttpGet("")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(BuildsModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<BuildsModel> ListBuilds(
            [FromQuery(Name = "page")] int currentPage = 1,
            [FromQuery(Name = "sort_field")] BlueprintService.SortField sortField = BlueprintService.SortField.Updated,
            [FromQuery(Name = "sort_direction")] BlueprintService.SortDirection sortDirection = BlueprintService.SortDirection.Desc,
            [FromQuery(Name = "q")] string? queryStr = null,
            [FromQuery(Name = "tags")] string? tagsCsv = null,
            [FromQuery(Name = "version")] string? version = null)
        {
            var blueprints = await _blueprintService.GetBlueprints(
                (currentPage, PageSize),
                (sortField, sortDirection),
                tagsCsv?.Split(',') ?? Array.Empty<string>(),
                queryStr, version);

            return blueprints.ToViewModel();
        }

        /// <summary>
        /// Get all details of a build
        /// </summary>
        /// <param name="owner" example="Fritz">The username of the desired build's owner</param>
        /// <param name="slug" example="my-awesome-build">The slug of the desired build</param>
        /// <response code="200" type="application/json">The details of the requested build</response>
        /// <response code="400" type="application/json">The request is malformed or invalid</response>
        /// <response code="404" type="application/json">The requested build does not exist</response>
        [HttpGet("{owner}/{slug}")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(BuildModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetDetails(string owner, string slug)
        {
            var blueprint = await _blueprintService.GetBlueprint(owner, slug);
            if (blueprint == null)
                return NotFound();

            return Ok(blueprint.ToViewModel());
        }

        /// <summary>
        /// Get the cover image of a build
        /// </summary>
        /// <param name="buildId" example="1c3828e3-de0d-41b8-9b3a-a15688f4217b">The id of the desired build</param>
        /// <response code="200" type="image/*">The cover image of the requested build</response>
        /// <response code="400" type="application/json">The request is malformed or invalid</response>
        /// <response code="404" type="application/json">The requested build does not exist</response>
        [HttpGet("{buildId}/cover")]
        [Produces("image/png", "image/jpeg", "image/gif")]
        [ProducesResponseType(typeof(byte[]), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ResponseCache(Duration = OneDayInSeconds, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetCover(Guid buildId)
        {
            var (file, format) = await _imageService.TryLoadCover(buildId);
            if (file == null)
                return NotFound();

            return File(file, format);
        }
    }
}
