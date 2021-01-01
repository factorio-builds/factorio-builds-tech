using FactorioTech.Api.Services;
using FactorioTech.Api.ViewModels;
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
        public class BuildsQueryParams
        {
            public const int PageSize = 100;

            /// <summary>
            /// The desired page
            /// </summary>
            [FromQuery(Name = "page")]
            public int Page { get; set; } = 1;

            /// <summary>
            /// The desired field to sort the results
            /// </summary>
            [FromQuery(Name = "sort_field")]
            public BlueprintService.SortField SortField { get; set; } = BlueprintService.SortField.Updated;

            /// <summary>
            /// The desired direction to sort the results
            /// </summary>
            [FromQuery(Name = "sort_direction")]
            public BlueprintService.SortDirection SortDirection { get; set; } = BlueprintService.SortDirection.Desc;

            /// <summary>
            /// An optional search term to filter the results by
            /// </summary>
            [FromQuery(Name = "q")]
            public string? Search { get; set; }

            /// <summary>
            /// An optional comma-separated list of tags to filter the results by
            /// </summary>
            [FromQuery(Name = "tags")]
            public string? TagsCsv { get; set; }

            /// <summary>
            /// An optional game version to filter the results by
            /// </summary>
            [FromQuery(Name = "version")]
            public string? Version { get; set; }

            public object ToValues(int? page) => new
            {
                page = page ?? Page,
                sort_field = SortField.ToString().ToLowerInvariant(),
                sort_direction = SortDirection.ToString().ToLowerInvariant(),
                q = Search,
                tags = TagsCsv,
                version = Version,
            };
        }

        private const int OneDayInSeconds = 86400;

        private readonly BlueprintConverter _blueprintConverter;
        private readonly BlueprintService _blueprintService;
        private readonly ImageService _imageService;

        public BuildController(
            BlueprintConverter blueprintConverter,
            BlueprintService blueprintService,
            ImageService imageService)
        {
            _blueprintConverter = blueprintConverter;
            _blueprintService = blueprintService;
            _imageService = imageService;
        }

        /// <summary>
        /// Get a paged, filtered and ordered list of builds
        /// </summary>
        /// <response code="200" type="application/json">The paged, filtered and ordered list of matching builds</response>
        /// <response code="400" type="application/json">The request is malformed or invalid</response>
        /// <response code="404" type="application/json">The requested build does not exist</response>
        [HttpGet("")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(BuildsModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<BuildsModel> ListBuilds([FromQuery]BuildsQueryParams query)
        {
            var (builds, hasMore, totalCount) = await _blueprintService.GetBlueprints(
                (query.Page, BuildsQueryParams.PageSize),
                (query.SortField, query.SortDirection),
                query.TagsCsv?.Split(',') ?? Array.Empty<string>(),
                query.Search,
                query.Version);

            return builds.ToViewModel(Url, query, hasMore, totalCount);
        }

        /// <summary>
        /// Get all details of a build
        /// </summary>
        /// <param name="owner" example="factorio_fritz">The username of the desired build's owner</param>
        /// <param name="slug" example="my-awesome-build">The slug of the desired build</param>
        /// <response code="200" type="application/json">The details of the requested build</response>
        /// <response code="400" type="application/json">The request is malformed or invalid</response>
        /// <response code="404" type="application/json">The requested build does not exist</response>
        [HttpGet("{owner}/{slug}")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(FullBuildModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetDetails(string owner, string slug)
        {
            var build = await _blueprintService.GetBlueprint(owner, slug);
            if (build?.LatestVersion?.Payload == null)
                return NotFound();

            var envelope = await _blueprintConverter.Decode(build.LatestVersion.Payload.Encoded);
            return Ok(build.ToFullViewModel(Url, envelope));
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
