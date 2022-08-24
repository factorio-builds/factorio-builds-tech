using FactorioTech.Api.Services;
using FactorioTech.Api.ViewModels;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Net.Mime;

namespace FactorioTech.Api.Controllers;

[ApiController]
[AutoConstructor]
[Route("users")]
public partial class UserController : ControllerBase
{
    private readonly BuildService buildService;

    /// <summary>
    ///     Get a paged, filtered and ordered list of builds created by the user
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
    public async Task<BuildsModel> ListBuilds(
        [Required] string username,
        [FromQuery] [Required] BuildsQueryParams query)
    {
        var (builds, hasMore, totalCount) = await buildService.GetBuilds(
            (query.Page, BuildsQueryParams.PageSize),
            (query.SortField, query.SortDirection),
            query.Tags ?? Array.Empty<string>(),
            query.Search,
            query.Version,
            username);

        return builds.ToViewModel(Url, query, hasMore, totalCount);
    }
}
