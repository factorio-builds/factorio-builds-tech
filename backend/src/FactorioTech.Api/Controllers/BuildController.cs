using FactorioTech.Api.Extensions;
using FactorioTech.Api.Services;
using FactorioTech.Api.ViewModels;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace FactorioTech.Api.Controllers
{
    [Route("builds")]
    [ApiController]
    public class BuildController : ControllerBase
    {
        private const int OneDayInSeconds = 86400;

        private readonly AppDbContext _dbContext;
        private readonly BlueprintConverter _blueprintConverter;
        private readonly BlueprintService _blueprintService;
        private readonly FollowerService _followerService;
        private readonly ImageService _imageService;

        public BuildController(
            AppDbContext dbContext,
            BlueprintConverter blueprintConverter,
            BlueprintService blueprintService,
            FollowerService followerService,
            ImageService imageService)
        {
            _dbContext = dbContext;
            _blueprintConverter = blueprintConverter;
            _blueprintService = blueprintService;
            _followerService = followerService;
            _imageService = imageService;
        }

        /// <summary>
        /// Get a paged, filtered and ordered list of builds
        /// </summary>
        /// <response code="200" type="application/json">The paged, filtered and ordered list of matching builds</response>
        /// <response code="400" type="application/json">The request is malformed or invalid</response>
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
                query.Version,
                null);

            return builds.ToViewModel(Url, query, hasMore, totalCount);
        }

        /// <summary>
        /// Create a new build with a previously created payload
        /// </summary>
        [Authorize]
        [HttpPost("")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(ThinBuildModel), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateBuild([FromForm]CreateBuildRequest request)
        {
            var result = await _blueprintService.CreateOrAddVersion(new BlueprintService.CreateRequest(
                    request.Slug.Trim(),
                    request.Title.Trim(),
                    request.Description?.Trim(),
                    request.Tags,
                    (request.Hash, request.Version?.Name?.Trim(), request.Version?.Description?.Trim(), request.Icons),
                    null),
                User.GetUserId());

            return result switch
            {
                BlueprintService.CreateResult.Success success => await HandleCreateSuccess(success.Blueprint, request.Cover),
                BlueprintService.CreateResult.DuplicateHash error => Conflict(error.ToProblem()),
                BlueprintService.CreateResult.DuplicateSlug error => Conflict(error.ToProblem()),
                {} error => BadRequest(error.ToProblem()),
            };
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

            var currentUserId = User.TryGetUserId();
            var currentUserIsFollower = currentUserId != null && await _dbContext.Favorites.AsNoTracking()
                .AnyAsync(f => f.BlueprintId == build.BlueprintId && f.UserId == currentUserId);

            var envelope = await _blueprintConverter.Decode(build.LatestVersion.Payload.Encoded);
            return Ok(build.ToFullViewModel(Url, envelope, currentUserIsFollower));
        }

        /// <summary>
        /// Get all users who have added this build to their favorites, ordered by the date when they started following the build
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
        public async Task<IActionResult> GetFollowers(string owner, string slug)
        {
            var buildId = await TryFindBuildId(owner, slug);
            if (buildId == Guid.Empty)
                return NotFound();

            var followers = await _dbContext.Favorites.AsNoTracking()
                .Where(f => f.BlueprintId == buildId)
                .OrderByDescending(f => f.CreatedAt)
                .Select(f => f.User!)
                .Distinct()
                .ToListAsync();

            return Ok(followers.ToViewModel());
        }

        /// <summary>
        /// Add the build to the user's favorites
        /// </summary>
        /// <param name="owner" example="factorio_fritz">The username of the desired build's owner</param>
        /// <param name="slug" example="my-awesome-build">The slug of the desired build</param>
        /// <response code="204" type="application/json">The build was added to the user's favorites</response>
        /// <response code="400" type="application/json">The request is malformed or invalid</response>
        /// <response code="404" type="application/json">The requested build does not exist</response>
        [HttpPut("{owner}/{slug}/followers")]
        [Authorize]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AddFavorite(string owner, string slug)
        {
            var buildId = await TryFindBuildId(owner, slug);
            if (buildId == Guid.Empty)
                return NotFound();

            await _followerService.AddToFavorites(buildId, User.GetUserId());
            return NoContent();
        }

        /// <summary>
        /// Remove the build from the user's favorites
        /// </summary>
        /// <param name="owner" example="factorio_fritz">The username of the desired build's owner</param>
        /// <param name="slug" example="my-awesome-build">The slug of the desired build</param>
        /// <response code="204" type="application/json">The build was removed from the user's favorites</response>
        /// <response code="400" type="application/json">The request is malformed or invalid</response>
        /// <response code="404" type="application/json">The requested build does not exist</response>
        [HttpDelete("{owner}/{slug}/followers")]
        [Authorize]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RemoveFavorite(string owner, string slug)
        {
            var buildId = await TryFindBuildId(owner, slug);
            if (buildId == Guid.Empty)
                return NotFound();

            await _followerService.RemoveFromFavorites(buildId, User.GetUserId());
            return NoContent();
        }

        /// <summary>
        /// Get all versions of a build, ordered by the creation date
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
        public async Task<IActionResult> GetVersions(string owner, string slug)
        {
            var versions = await _dbContext.Blueprints.AsNoTracking()
                .Where(bp => bp.NormalizedOwnerSlug == owner.ToUpperInvariant() && bp.NormalizedSlug == slug.ToUpperInvariant())
                .Join(_dbContext.BlueprintVersions.AsNoTracking(), bp => bp.BlueprintId, v => v.BlueprintId, (bp, v) => v)
                .OrderBy(v => v.CreatedAt)
                .ToListAsync();

            if (versions?.Any() != true)
                return NotFound();

            return Ok(versions.ToViewModel(Url));
        }

        /// <summary>
        /// Delete a build with all versions.
        /// **NOTE**: This is currently a HARD DELETE that requires the `Administrator` role.
        /// </summary>
        /// <param name="owner" example="factorio_fritz">The username of the desired build's owner</param>
        /// <param name="slug" example="my-awesome-build">The slug of the desired build</param>
        /// <response code="204">The build was deleted successfully</response>
        /// <response code="400" type="application/json">The request is malformed or invalid</response>
        /// <response code="404" type="application/json">The requested build does not exist</response>
        [HttpDelete("{owner}/{slug}")]
        [Authorize(Roles = Role.Administrator)]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteBuild(string owner, string slug)
        {
            var build = await _dbContext.Blueprints
                .Where(bp => bp.NormalizedOwnerSlug == owner.ToUpperInvariant() && bp.NormalizedSlug == slug.ToUpperInvariant())
                .FirstOrDefaultAsync();

            if (build == null)
                return NotFound();

            var versions = await _dbContext.BlueprintVersions
                .Where(v => v.BlueprintId == build.BlueprintId)
                .ToListAsync();

            _dbContext.Remove(build);
            _dbContext.RemoveRange(versions);

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Add a new version with a previously created payload to a build
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
        public async Task<IActionResult> AddVersion(string owner, string slug, [FromForm]CreateVersionRequest request)
        {
            var result = await _blueprintService.CreateOrAddVersion(new BlueprintService.CreateRequest(
                    slug,
                    request.Title.Trim(),
                    request.Description?.Trim(),
                    request.Tags,
                    (request.Hash, request.Version?.Name?.Trim(), request.Version?.Description?.Trim(), request.Icons),
                    request.ExpectedPreviousVersionId),
                User.GetUserId());

            return result switch
            {
                BlueprintService.CreateResult.Success success => await HandleCreateSuccess(success.Blueprint, request.Cover),
                BlueprintService.CreateResult.DuplicateHash error => Conflict(error.ToProblem()),
                BlueprintService.CreateResult.ParentNotFound error => NotFound(error.ToProblem()),
                {} error => BadRequest(error.ToProblem()),
            };
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

        private async Task<IActionResult> HandleCreateSuccess(Blueprint created, CreateRequestBase.ImageData cover)
        {
            if (cover.File != null)
            {
                await _imageService.SaveCroppedCover(
                    created.BlueprintId,
                    cover.File.OpenReadStream(),
                    (cover.X, cover.Y, cover.Width, cover.Height));
            }
            else if (cover.Hash != null)
            {
                await _imageService.SaveCroppedCover(
                    created.BlueprintId,
                    created.LatestVersionId!.Value, cover.Hash.Value,
                    (cover.X, cover.Y, cover.Width, cover.Height));
            }

            return Created(Url.ActionLink(nameof(GetDetails), "Build", new
            {
                owner = created.OwnerSlug,
                slug = created.Slug,
            }), created.ToThinViewModel(Url));
        }

        private async Task<Guid> TryFindBuildId(string owner, string slug) =>
            await _dbContext.Blueprints.AsNoTracking()
                .Where(bp => bp.NormalizedOwnerSlug == owner.ToUpperInvariant() && bp.NormalizedSlug == slug.ToUpperInvariant())
                .Select(bp => bp.BlueprintId)
                .FirstOrDefaultAsync();
    }
}
