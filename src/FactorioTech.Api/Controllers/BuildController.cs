using FactorioTech.Api.ViewModels;
using FactorioTech.Core;
using Microsoft.AspNetCore.Mvc;
using System;
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
        [HttpGet("")]
        public async Task<BuildsModel> ListBuilds(
            [FromQuery(Name = "page")] int currentPage = 1,
            [FromQuery(Name = "q")] string? queryStr = null,
            [FromQuery(Name = "tags")] string? tagsCsv = null,
            [FromQuery(Name = "version")] string? version = null,
            [FromQuery(Name = "sort_field")] BlueprintService.SortField? sortField = null,
            [FromQuery(Name = "sort_direction")] BlueprintService.SortDirection? sortDirection = null)
        {
            var blueprints = await _blueprintService.GetBlueprints(
                (currentPage, PageSize),
                (sortField ?? BlueprintService.SortField.Updated, sortDirection ?? BlueprintService.SortDirection.Desc),
                tagsCsv?.Split(',') ?? Array.Empty<string>(),
                queryStr, version);

            return blueprints.ToViewModel();
        }

        /// <summary>
        /// Get all details of a build
        /// </summary>
        [HttpGet("{ownerSlug}/{buildSlug}")]
        public async Task<IActionResult> GetDetails(string ownerSlug, string buildSlug)
        {
            var blueprint = await _blueprintService.GetBlueprint(ownerSlug, buildSlug);
            if (blueprint == null)
                return NotFound();

            return Ok(blueprint.ToViewModel());
        }

        /// <summary>
        /// Get the cover image of a build
        /// </summary>
        [HttpGet("{buildId}/cover")]
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
