using Markdig;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Threading.Tasks;

namespace FactorioTech.Web.TagHelpers
{
    public class MarkdownTagHelper : TagHelper
    {
        private static readonly MarkdownPipeline _pipeline =
            new MarkdownPipelineBuilder()
                .UseAutoLinks()
                .UseBootstrap()
                .UseEmphasisExtras()
                .UseEmojiAndSmiley()
                .UseMediaLinks()
                .DisableHtml()
                .Build();

        public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
        {
            var childContent = await output.GetChildContentAsync(NullHtmlEncoder.Default);
            var content = childContent.GetContent(NullHtmlEncoder.Default);

            output.TagName = null;
            output.Content.SetHtmlContent(Markdown.ToHtml(content, _pipeline));
        }
    }
}
