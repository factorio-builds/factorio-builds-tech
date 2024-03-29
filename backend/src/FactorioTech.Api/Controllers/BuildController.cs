using FactorioTech.Api.Services;
using FactorioTech.Api.ViewModels;
using FactorioTech.Api.ViewModels.Requests;
using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Hellang.Middleware.ProblemDetails;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Net.Mime;

namespace FactorioTech.Api.Controllers;

[ApiController]
[AutoConstructor]
[Route("builds")]
public partial class BuildController : ControllerBase
{
    private readonly AppDbContext dbContext;
    private readonly BlueprintConverter blueprintConverter;
    private readonly BuildService buildService;
    private readonly FollowerService followerService;
    private readonly ImageService imageService;

    /// <summary>
    ///     Get a paged, filtered and ordered list of builds
    /// </summary>
    /// <response code="200" type="application/json">The paged, filtered and ordered list of matching builds</response>
    /// <response code="400" type="application/json">The request is malformed or invalid</response>
    [HttpGet("")]
    [Produces(MediaTypeNames.Application.Json)]
    [Consumes(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(BuildsModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<BuildsModel> ListBuilds(
        [FromQuery] [Required] BuildsQueryParams query)
    {
        var (builds, hasMore, totalCount) = await buildService.GetBuilds(
            (query.Page, BuildsQueryParams.PageSize),
            (query.SortField, query.SortDirection),
            query.Tags ?? Array.Empty<string>(),
            query.Search,
            query.Version,
            null);

        return builds.ToViewModel(Url, query, hasMore, totalCount);
    }

    /// <summary>
    ///     Create a new build with a previously created payload
    /// </summary>
    [Authorize]
    [HttpPost("")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ThinBuildModel), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateBuild(
        [FromForm] [Required] CreateBuildRequest request)
    {
        await using var cover = await SaveTempCover(request.Cover);

        var result = await buildService.CreateOrAddVersion(new BuildService.CreateRequest(
                User.GetUserName(),
                request.Slug,
                request.Title,
                request.Description,
                request.Tags,
                (request.Hash, request.Version.Name, request.Version.Description, request.Version.Icons),
                null),
            cover, User);

        return result switch
        {
            BuildService.CreateResult.Success success => Created(Url.ActionLink(nameof(GetDetails), "Build", new
            {
                owner = success.Build.OwnerSlug,
                slug = success.Build.Slug,
            })!, success.Build.ToThinViewModel(Url)),
            BuildService.CreateResult.DuplicateHash error => Conflict(error.ToProblem()),
            BuildService.CreateResult.DuplicateSlug error => Conflict(error.ToProblem()),
            _ => BadRequest(result.ToProblem()),
        };
    }

    /// <summary>
    ///     Get all details of a build
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
    public async Task<IActionResult> GetDetails(
        [Required] string owner,
        [Required] string slug)
    {
        var (build, currentUserIsFollower) = await buildService.GetDetails(owner, slug, User);
        if (build?.LatestVersion?.Payload == null)
            return NotFound();

        var envelope = await blueprintConverter.Decode(build.LatestVersion.Payload.Encoded);
        return Ok(build.ToFullViewModel(Url, envelope, currentUserIsFollower));
    }

    /// <summary>
    ///     Edit the metadata of a build.
    /// </summary>
    /// <param name="owner" example="factorio_fritz">The username of the desired build's owner</param>
    /// <param name="slug" example="my-awesome-build">The slug of the desired build</param>
    /// <param name="request">The request parameters</param>
    /// <response code="200" type="application/json">The metadata to update.</response>
    /// <response code="400" type="application/json">The request is malformed or invalid</response>
    /// <response code="404" type="application/json">The requested build does not exist</response>
    [Authorize]
    [HttpPatch("{owner}/{slug}")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ThinBuildModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> EditDetails(
        [Required] string owner,
        [Required] string slug,
        [FromForm] [Required] EditBuildRequest request)
    {
        await using var cover = request.Cover != null
            ? await SaveTempCover(request.Cover)
            : null;

        var result = await buildService.Edit(new BuildService.EditRequest(
            owner, slug, request.Title, request.Description, request.Tags), cover, User);

        return result switch
        {
            BuildService.EditResult.Success success => Ok(success.Build.ToThinViewModel(Url)),
            BuildService.EditResult.NotAuthorized _ => Forbid(),
            BuildService.EditResult.BuildNotFound error => NotFound(error.ToProblem()),
            _ => BadRequest(result.ToProblem()),
        };
    }

    /// <summary>
    ///     Get all users who have added this build to their favorites, ordered by the date when they started following the
    ///     build
    /// </summary>
    /// <param name="owner" example="factorio_fritz">The username of the desired build's owner</param>
    /// <param name="slug" example="my-awesome-build">The slug of the desired build</param>
    /// <response code="200" type="application/json">An ordered list of followers</response>
    /// <response code="400" type="application/json">The request is malformed or invalid</response>
    /// <response code="404" type="application/json">The requested build does not exist</response>
    [HttpGet("{owner}/{slug}/followers")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(UsersModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetFollowers(
        [Required] string owner,
        [Required] string slug)
    {
        var followers = await followerService.Get(owner, slug);
        if (followers == null)
            return NotFound();

        return Ok(followers.ToViewModel());
    }

    /// <summary>
    ///     Add the build to the user's favorites
    /// </summary>
    /// <param name="owner" example="factorio_fritz">The username of the desired build's owner</param>
    /// <param name="slug" example="my-awesome-build">The slug of the desired build</param>
    /// <response code="204" type="application/json">The build was added to the user's favorites</response>
    /// <response code="400" type="application/json">The request is malformed or invalid</response>
    /// <response code="404" type="application/json">The requested build does not exist</response>
    [Authorize]
    [HttpPut("{owner}/{slug}/followers")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AddFavorite(
        [Required] string owner,
        [Required] string slug)
    {
        var mutated = await followerService.Follow(owner, slug, User);
        if (mutated == null)
            return NotFound();

        return NoContent();
    }

    /// <summary>
    ///     Remove the build from the user's favorites
    /// </summary>
    /// <param name="owner" example="factorio_fritz">The username of the desired build's owner</param>
    /// <param name="slug" example="my-awesome-build">The slug of the desired build</param>
    /// <response code="204" type="application/json">The build was removed from the user's favorites</response>
    /// <response code="400" type="application/json">The request is malformed or invalid</response>
    /// <response code="404" type="application/json">The requested build does not exist</response>
    [Authorize]
    [HttpDelete("{owner}/{slug}/followers")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveFavorite(
        [Required] string owner,
        [Required] string slug)
    {
        var mutated = await followerService.Unfollow(owner, slug, User);
        if (mutated == null)
            return NotFound();

        return NoContent();
    }

    /// <summary>
    ///     Get all versions of a build, ordered by the creation date
    /// </summary>
    /// <param name="owner" example="factorio_fritz">The username of the desired build's owner</param>
    /// <param name="slug" example="my-awesome-build">The slug of the desired build</param>
    /// <response code="200" type="application/json">An ordered list of versions</response>
    /// <response code="400" type="application/json">The request is malformed or invalid</response>
    /// <response code="404" type="application/json">The requested build does not exist</response>
    [HttpGet("{owner}/{slug}/versions")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(VersionsModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetVersions(
        [Required] string owner,
        [Required] string slug)
    {
        var versions = await dbContext.Builds.AsNoTracking()
            .Where(bp =>
                bp.NormalizedOwnerSlug == owner.ToUpperInvariant() && bp.NormalizedSlug == slug.ToUpperInvariant())
            .Join(dbContext.Versions.AsNoTracking(), bp => bp.BuildId, v => v.BuildId, (bp, v) => v)
            .OrderBy(v => v.CreatedAt)
            .ToListAsync();

        if (versions?.Any() != true)
            return NotFound();

        return Ok(versions.ToViewModel(Url));
    }

    /// <summary>
    ///     Delete a build with all versions.
    ///     **NOTE**: This is currently a HARD DELETE that requires the `Administrator` role.
    /// </summary>
    /// <param name="owner" example="factorio_fritz">The username of the desired build's owner</param>
    /// <param name="slug" example="my-awesome-build">The slug of the desired build</param>
    /// <response code="204">The build was deleted successfully</response>
    /// <response code="400" type="application/json">The request is malformed or invalid</response>
    /// <response code="404" type="application/json">The requested build does not exist</response>
    [Authorize(Roles = Role.Administrator)]
    [HttpDelete("{owner}/{slug}")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteBuild(
        [Required] string owner,
        [Required] string slug)
    {
        return await buildService.Delete(owner, slug, User) switch
        {
            BuildService.DeleteResult.Success _ => NoContent(),
            BuildService.DeleteResult.NotAuthorized _ => Forbid(),
            BuildService.DeleteResult.BuildNotFound error => NotFound(error.ToProblem()),
            { } error => BadRequest(error.ToProblem()),
        };
    }

    /// <summary>
    ///     Add a new version with a previously created payload to a build
    /// </summary>
    /// <param name="owner" example="factorio_fritz">The username of the desired build's owner</param>
    /// <param name="slug" example="my-awesome-build">The slug of the desired build</param>
    /// <param name="request">The request parameters</param>
    /// <response code="200" type="application/json">An ordered list of versions</response>
    /// <response code="400" type="application/json">The request is malformed or invalid</response>
    /// <response code="404" type="application/json">The requested build does not exist</response>
    [Authorize]
    [HttpPost("{owner}/{slug}/versions")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(FullVersionModel), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AddVersion(
        [Required] string owner,
        [Required] string slug,
        [FromForm] [Required] CreateVersionRequest request)
    {
        await using var cover = await SaveTempCover(request.Cover);

        var result = await buildService.CreateOrAddVersion(new BuildService.CreateRequest(
                owner,
                slug,
                request.Title,
                request.Description,
                request.Tags,
                (request.Hash, request.Version.Name, request.Version.Description, request.Version.Icons),
                request.ExpectedPreviousVersionId),
            cover, User);

        return result switch
        {
            BuildService.CreateResult.Success success => Created(Url.ActionLink(nameof(GetDetails), "Build", new
            {
                owner = success.Build.OwnerSlug,
                slug = success.Build.Slug,
            })!, success.Build.ToThinViewModel(Url)),
            BuildService.CreateResult.NotAuthorized _ => Forbid(),
            BuildService.CreateResult.DuplicateHash error => Conflict(error.ToProblem()),
            BuildService.CreateResult.BuildNotFound error => NotFound(error.ToProblem()),
            _ => BadRequest(result.ToProblem()),
        };
    }

    private async Task<ITempCoverHandle> SaveTempCover(CoverRequest cover)
    {
        try
        {
            if (cover.File != null)
            {
                return await imageService.SaveCroppedCover(
                    cover.File.OpenReadStream(), cover.Crop);
            }

            if (cover.Hash != null)
            {
                return await imageService.SaveCroppedCover(
                    cover.Hash.Value, cover.Crop);
            }

            throw new Exception($"Either {nameof(cover.File)} or {nameof(cover.Hash)} must be set.");
        }
        catch (Exception ex)
        {
            ModelState.AddModelError(nameof(CreateRequestBase.Cover), ex.Message);
            throw new ProblemDetailsException(new ValidationProblemDetails(ModelState)
            {
                Status = StatusCodes.Status400BadRequest,
            });
        }
    }
}
