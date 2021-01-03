using FactorioTech.Api.Extensions;
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
using System.Linq;
using System.Net.Mime;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FactorioTech.Api.Controllers
{
    [Route("rpc")]
    [ApiController]
    public class RpcController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public RpcController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// Convert markdown to HTML.
        /// This operation is **safe** and **idempotent**.
        /// </summary>
        /// <param name="content" example='"Hello **world**!"'>The markdown text that should be converted to HTML</param>
        /// <response code="200" type="text/html" example="Hello &lt;strong&gt;World&lt;strong&gt;!">The converted HTML</response>
        /// <response code="400" type="application/json">The request is malformed or invalid</response>
        [Authorize]
        [HttpPost("render-markdown")]
        public string RenderMarkdown([FromBody]string content) => MarkdownConverter.ToHtml(content);

        /// <summary>
        /// Verify that a username is valid and available.
        /// This operation is **safe** and **idempotent**.
        /// </summary>
        /// <param name="username" example='"bob"'>The username to validate</param>
        /// <response code="200" example="true">The validation result</response>
        [HttpPost("validate-username")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<bool> ValidateUsername([FromBody]string username)
        {
            if (!Regex.IsMatch(username, $"^{AppConfig.Policies.Slug.AllowedCharactersRegex}$"))
                return false;

            var exists = await _dbContext.Users
                .AnyAsync(x => x.NormalizedUserName == username.ToUpperInvariant());

            return !exists;
        }

        /// <summary>
        /// Verify that a slug is valid and available for the authenticated user.
        /// This operation is **safe** and **idempotent**.
        /// </summary>
        /// <param name="slug" example='"my-build"'>The slug to validate</param>
        /// <response code="200" example="true">The validation result</response>
        [Authorize]
        [HttpPost("validate-slug")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<bool> ValidateSlug([FromBody]string slug)
        {
            if (!Regex.IsMatch(slug, $"^{AppConfig.Policies.Slug.AllowedCharactersRegex}$"))
                return false;

            var exists = await _dbContext.Blueprints
                .AnyAsync(x => x.NormalizedSlug == slug.ToUpperInvariant() && x.OwnerId == User.GetUserId());

            return !exists;
        }

        /// <summary>
        /// Add or remove a build from the authenticated user's favorites
        /// </summary>
        /// <param name="buildId" example='"0758cb59-804e-437f-9f2e-d3885047a548"'>The build id</param>
        /// <response code="200">The build has been added or removed successfully</response>
        [Authorize]
        [HttpPost("toggle-favorite")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> ToggleFavorite([FromBody]Guid buildId)
        {
            var favorite = await _dbContext.Favorites.AsNoTracking()
                .FirstOrDefaultAsync(x => x.BlueprintId == buildId && x.UserId == User.GetUserId());

            if (favorite != null)
            {
                _dbContext.Remove(favorite);
            }
            else
            {
                _dbContext.Add(new Favorite
                {
                    BlueprintId = buildId,
                    UserId = User.GetUserId(),
                });
            }

            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// The ping endpoint always returns the string `pong`.
        /// </summary>
        [HttpGet("test-ping")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        public string TestPing() => "pong";

        /// <summary>
        /// Get the authenticated user's claims.
        /// </summary>
        [Authorize]
        [HttpGet("test-auth")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(IDictionary<string, string>), StatusCodes.Status200OK)]
        public IEnumerable<KeyValuePair<string, string>> TestAuth() =>  User.Claims.Select(x => new KeyValuePair<string, string>(x.Type, x.Value));

        /// <summary>
        /// Get the authenticated user's claims. Requires the `Moderator` role.
        /// </summary>
        [Authorize(Roles = "Moderator")]
        [HttpGet("test-moderator")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(IDictionary<string, string>), StatusCodes.Status200OK)]
        public IEnumerable<KeyValuePair<string, string>> TestModerator() => User.Claims.Select(x => new KeyValuePair<string, string>(x.Type, x.Value));

        /// <summary>
        /// Get the authenticated user's claims. Requires the `Administrator` role.
        /// </summary>
        [Authorize(Roles = "Administrator")]
        [HttpGet("test-admin")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(IDictionary<string, string>), StatusCodes.Status200OK)]
        public IEnumerable<KeyValuePair<string, string>> TestAdmin() => User.Claims.Select(x => new KeyValuePair<string, string>(x.Type, x.Value));
    }
}