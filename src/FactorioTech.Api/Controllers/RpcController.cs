using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Api.Controllers
{
    [Route("rpc")]
    [ApiController]
    public class RpcController : ControllerBase
    {
        public class RenderMarkdownRequest
        {
            /// <summary>
            /// The markdown text that should be converted to HTML
            /// </summary>
            /// <example>"Hello **world**!"</example>
            [Required]
            public string Content { get; init; } = string.Empty;
        }

        /// <summary>
        /// Convert markdown to HTML. This operation has no side-effects.
        /// </summary>
        /// <response code="200" type="text/html" example="asdasdasd blub">The converted HTML</response>
        /// <response code="400" type="application/json">The request is malformed or invalid</response>
        [HttpPost("render-markdown")]
        public string RenderMarkdown([FromBody]RenderMarkdownRequest request) => MarkdownConverter.ToHtml(request.Content);
    }
}
