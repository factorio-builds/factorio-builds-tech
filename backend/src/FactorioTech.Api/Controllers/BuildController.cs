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
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
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
        private readonly ImageService _imageService;

        public BuildController(
            AppDbContext dbContext,
            BlueprintConverter blueprintConverter,
            BlueprintService blueprintService,
            ImageService imageService)
        {
            _dbContext = dbContext;
            _blueprintConverter = blueprintConverter;
            _blueprintService = blueprintService;
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
        public async Task<IActionResult> CreateBuild([FromBody]CreateBuildRequest request)
        {
            var result = await _blueprintService.CreateOrAddVersion(new BlueprintService.CreateRequest(
                    request.Slug.Trim(),
                    request.Title.Trim(),
                    request.Description?.Trim(),
                    request.Tags,
                    (request.Hash, request.VersionName?.Trim(), request.VersionDescription?.Trim(), request.Icons),
                    null),
                User.GetUserId());

            return result switch
            {
                BlueprintService.CreateResult.Success success => Created(
                    Url.ActionLink(nameof(GetDetails), "Build", new
                    {
                        owner = success.Blueprint.OwnerSlug,
                        slug = success.Blueprint.Slug,
                    }),
                    success.Blueprint.ToThinViewModel(Url)),
                BlueprintService.CreateResult.DuplicateHash error => Conflict(error.ToProblem()),
                BlueprintService.CreateResult.DuplicateSlug error => Conflict(error.ToProblem()),
                _ => BadRequest(result.ToProblem()),
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

            var envelope = await _blueprintConverter.Decode(build.LatestVersion.Payload.Encoded);
            return Ok(build.ToFullViewModel(Url, envelope));
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
            var buildId = await _dbContext.Blueprints.AsNoTracking()
                .Where(bp => bp.NormalizedOwnerSlug == owner.ToUpperInvariant() && bp.NormalizedSlug == slug.ToUpperInvariant())
                .Select(bp => bp.BlueprintId)
                .FirstOrDefaultAsync();

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
        public async Task<IActionResult> AddVersion(string owner, string slug, [FromBody]CreateVersionRequest request)
        {
            var result = await _blueprintService.CreateOrAddVersion(new BlueprintService.CreateRequest(
                    slug,
                    request.Title.Trim(),
                    request.Description?.Trim(),
                    request.Tags,
                    (request.Hash, request.VersionName?.Trim(), request.VersionDescription?.Trim(), request.Icons),
                    request.ExpectedPreviousVersionId),
                User.GetUserId());

            return result switch
            {
                BlueprintService.CreateResult.Success success => Created(
                    Url.ActionLink(nameof(GetDetails), "Build", new
                    {
                        owner = success.Blueprint.OwnerSlug,
                        slug = success.Blueprint.Slug,
                    }),
                    success.Blueprint.ToThinViewModel(Url)),
                BlueprintService.CreateResult.DuplicateHash error => Conflict(error.ToProblem()),
                BlueprintService.CreateResult.ParentNotFound error => NotFound(error.ToProblem()),
                _ => BadRequest(result.ToProblem()),
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

        public class CreateRequestBase
        {
            /// <summary>
            /// The hash of payload that should be used to create this build version.
            /// The payload must have been previously created.
            /// </summary>
            /// <example>f8283ab0085a7e31c0ad3c43db36ae87</example>
            [Required]
            public Hash Hash { get; set; }

            /// <summary>
            /// The title or display name of the build.
            /// </summary>
            /// <example>My Awesome Build</example>
            [Required]
            [StringLength(100, MinimumLength = 3)]
            public string Title { get; set; } = null!;

            /// <summary>
            /// The build description in Markdown.
            /// </summary>
            /// <example>Hello **World**!</example>
            public string? Description { get; set; }

            /// <summary>
            /// An optional name for the version to be created.
            /// If empty, the hash will be used as version name.
            /// </summary>
            [StringLength(100, MinimumLength = 2)]
            public string? VersionName { get; set; }

            /// <summary>
            /// An optional description for the version to be created.
            /// </summary>
            [DisplayName("Description")]
            public string? VersionDescription { get; set; }

            /// <summary>
            /// The build's tags.
            /// </summary>
            [Required]
            public IEnumerable<string> Tags { get; set; } = null!;

            /// <summary>
            /// The build's icons.
            /// </summary>
            [Required]
            public IEnumerable<GameIcon> Icons { get; set; } = null!;
        }

        public class CreateVersionRequest : CreateRequestBase
        {
            /// <summary>
            /// The current (latest) version of the build. It must be specified to avoid concurrency issues.
            /// </summary>
            [Required]
            public Guid ExpectedPreviousVersionId { get; set; }
        }

        public class CreateBuildRequest : CreateRequestBase
        {
            /// <summary>
            /// The slug for the new build. It is used in the build's URL and must be unique per user.
            /// It can consist only of latin alphanumeric characters, underscores and hyphens.
            /// </summary>
            /// <example>my-awesome-build</example>
            [Required]
            [StringLength(AppConfig.Policies.Slug.MaximumLength, MinimumLength = AppConfig.Policies.Slug.MinimumLength)]
            [RegularExpression(AppConfig.Policies.Slug.AllowedCharactersRegex)]
            public string Slug { get; set; } = null!;
        }
    }
}
