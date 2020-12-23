using Markdig;

namespace FactorioTech.Core
{
    public class MarkdownConverter
    {
        private static readonly MarkdownPipeline Pipeline =
            new MarkdownPipelineBuilder()
                .UseAutoLinks()
                .UseBootstrap()
                .UseEmphasisExtras()
                .UseEmojiAndSmiley()
                .UseMediaLinks()
                .DisableHtml()
                .Build();

        public static string ToHtml(string content) => Markdown.ToHtml(content, Pipeline);
    }
}
