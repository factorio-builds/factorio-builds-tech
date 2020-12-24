using FactorioTech.Core;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Threading.Tasks;

namespace FactorioTech.Web.TagHelpers
{
    public class MarkdownTagHelper : TagHelper
    {
        public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
        {
            var childContent = await output.GetChildContentAsync(NullHtmlEncoder.Default);
            var content = childContent.GetContent(NullHtmlEncoder.Default);

            output.TagName = null;
            output.Content.SetHtmlContent(MarkdownConverter.ToHtml(content));
        }
    }
}
