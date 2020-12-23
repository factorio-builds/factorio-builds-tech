using FactorioTech.Core;
using Microsoft.AspNetCore.Mvc;

namespace FactorioTech.Api.Controllers
{
    [Route("rpc")]
    [ApiController]
    public class RpcController : ControllerBase
    {
        public record RenderMarkdownRequest(string Content);

        /// <summary>
        /// Convert markdown to HTML. This operation has no side-effects.
        /// </summary>
        [HttpPost("render-markdown")]
        [Produces("text/html")]
        public string RenderMarkdown([FromBody]RenderMarkdownRequest request) => MarkdownConverter.ToHtml(request.Content);
    }
}
