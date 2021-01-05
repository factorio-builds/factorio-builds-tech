using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FactorioTech.Api.ViewModels
{
    public abstract class ViewModelBase<TLinks> where TLinks: new()
    {
        [Required]
        [JsonPropertyName("_links")]
        public TLinks Links { get; init; } = new();
    }

    public class LinkModel
    {
        [Required]
        public string Href { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Method { get; set; }

        public LinkModel(string href, string? method = null)
        {
            Href = href;
            Method = method;
        }
    };

    public class ImageLinkModel : LinkModel
    {
        [Required]
        public int Width { get; init; }

        [Required]
        public int Height { get; init; }

        [StringLength(256)]
        public string? Alt { get; init; }

        public ImageLinkModel(string href, int width, int height, string? alt = null) : base(href)
        {
            Width = width;
            Height = height;
            Alt = alt;
        }
    }
}
