using FactorioTech.Api.Extensions;
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
    [Route("users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly BlueprintService _blueprintService;

        public UserController(
            BlueprintService blueprintService)
        {
            _blueprintService = blueprintService;
        }

        /// <summary>
        /// Get a paged, filtered and ordered list of builds created by the user
        /// </summary>
        /// <param name="username" example="factorio_fritz">The desired user's username</param>
        /// <param name="query">The query parameters</param>
        /// <response code="200" type="application/json">The paged, filtered and ordered list of matching builds</response>
        /// <response code="400" type="application/json">The request is malformed or invalid</response>
        /// <response code="404" type="application/json">The requested user does not exist</response>
        [HttpGet("{username}/builds")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(BuildsModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<BuildsModel> ListBuilds(string username, [FromQuery]BuildsQueryParams query)
        {
            var (builds, hasMore, totalCount) = await _blueprintService.GetBlueprints(
                (query.Page, BuildsQueryParams.PageSize),
                (query.SortField, query.SortDirection),
                query.TagsCsv?.Split(',') ?? Array.Empty<string>(),
                query.Search,
                query.Version,
                username);

            return builds.ToViewModel(Url, query, hasMore, totalCount);
        }
    }
}
