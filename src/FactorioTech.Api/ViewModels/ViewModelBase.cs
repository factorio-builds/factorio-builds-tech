using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FactorioTech.Api.ViewModels
{
    public abstract class ViewModelBase
    {
        [Required]
        [JsonPropertyName("_links")]
        public IReadOnlyDictionary<string, LinkModel> Links { get; init; } = new Dictionary<string, LinkModel>();
    }

    public class LinkModel
    {
        [Required]
        public string Href { get; set; }

        public LinkModel(string href)
        {
            Href = href;
        }
    };

    public class ImageLinkModel : LinkModel
    {
        [Required]
        public int Width { get; set; }
        
        [Required]
        public int Height { get; set; }

        [StringLength(256)]
        public string? Alt { get; set; }

        public ImageLinkModel(string href, int width, int height, string? alt = null) : base(href)
        {
            Width = width;
            Height = height;
            Alt = alt;
        }
    }
}
