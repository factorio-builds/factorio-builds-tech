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

        [Required]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Method { get; set; }

        [JsonExtensionData]
        public IDictionary<string, object> AdditionalProperties { get; } = new Dictionary<string, object>();

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

            // todo: this is intended behavior, but maybe there's a better way to handle polymorphism?
            // see https://docs.microsoft.com/en-us/dotnet/standard/serialization/system-text-json-polymorphism

            AdditionalProperties[nameof(width)] = width;
            AdditionalProperties[nameof(height)] = height;

            if (alt != null)
            {
                AdditionalProperties[nameof(alt)] = alt;
            }
        }
    }
}
