using FactorioTech.Core;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SluggyUnidecode;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace FactorioTech.Api.Controllers
{
    [Route("rpc")]
    [ApiController]
    public class RpcController : ControllerBase
    {
        private readonly SlugService _slugService;

        public RpcController(SlugService slugService)
        {
            _slugService = slugService;
        }

        /// <summary>
        /// Verify that a username is valid and available.
        /// This operation is **safe** and **idempotent**.
        /// </summary>
        /// <param name="username" example='"bob"'>The username to validate</param>
        /// <response code="200" example="true">The validation result</response>
        [HttpPost("validate-username")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(SlugService.SlugValidationResult), StatusCodes.Status200OK)]
        public Task<SlugService.SlugValidationResult> ValidateUsername([FromBody, Required]string username) =>
            _slugService.ValidateUsername(TryValidateModel, username);

        /// <summary>
        /// Verify that a slug is valid and available for the authenticated user.
        /// This operation is **safe** and **idempotent**.
        /// </summary>
        /// <param name="slug" example='"my-build"'>The slug to validate</param>
        /// <response code="200" example="true">The validation result</response>
        [Authorize]
        [HttpPost("validate-slug")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(SlugService.SlugValidationResult), StatusCodes.Status200OK)]
        public Task<SlugService.SlugValidationResult> ValidateSlug([FromBody, Required]string slug) =>
            _slugService.Validate(TryValidateModel, slug, User.GetUserId());

        /// <summary>
        /// Convert a title to a slug and verify that it is available for the authenticated user.
        /// This operation is **safe** and **idempotent**.
        /// </summary>
        /// <param name="title" example='"my-build"'>The title to convert and validate</param>
        /// <response code="200">The converted title and validation result</response>
        [Authorize]
        [HttpPost("convert-and-validate-title")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(SlugService.SlugValidationResult), StatusCodes.Status200OK)]
        public Task<SlugService.SlugValidationResult> ConvertAndValidateTitle([FromBody, Required]string title) =>
            _slugService.Validate(TryValidateModel, title.ToSlug(), User.GetUserId());

        /// <summary>
        /// Get the authenticated user's claims.
        /// </summary>
        [Authorize]
        [HttpGet("test-auth")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(IDictionary<string, string>), StatusCodes.Status200OK)]
        public IEnumerable<KeyValuePair<string, string>> TestAuth() => 
            User.Claims.Select(x => new KeyValuePair<string, string>(x.Type, x.Value));

        /// <summary>
        /// Get the authenticated user's claims. Requires the `Moderator` role.
        /// </summary>
        [Authorize(Roles = Role.Moderator)]
        [HttpGet("test-moderator")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(IDictionary<string, string>), StatusCodes.Status200OK)]
        public IEnumerable<KeyValuePair<string, string>> TestModerator() =>
            User.Claims.Select(x => new KeyValuePair<string, string>(x.Type, x.Value));

        /// <summary>
        /// Get the authenticated user's claims. Requires the `Administrator` role.
        /// </summary>
        [Authorize(Roles = Role.Administrator)]
        [HttpGet("test-admin")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(IDictionary<string, string>), StatusCodes.Status200OK)]
        public IEnumerable<KeyValuePair<string, string>> TestAdmin() =>
            User.Claims.Select(x => new KeyValuePair<string, string>(x.Type, x.Value));
    }
}
