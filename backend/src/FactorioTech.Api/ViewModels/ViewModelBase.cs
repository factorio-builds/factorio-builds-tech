using System.ComponentModel.DataAnnotations;
using System.Net.Http;
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
        /// <summary>
        /// The absolute URL of the linked resource.
        /// </summary>
        [Required]
        public string Href { get; }

        /// <summary>
        /// The HTTP method to request the linked resource.
        /// Defaults to `GET` if unset (`null`).
        /// </summary>
        public string? Method { get; }

        public LinkModel(string href, HttpMethod? method = null)
        {
            Href = href;
            Method = method?.Method;
        }
    }

    public class ImageLinkModel : LinkModel
    {
        /// <summary>
        /// The width of the linked image.
        /// </summary>
        [Required]
        public int Width { get; init; }

        /// <summary>
        /// The height of the linked image.
        /// </summary>
        [Required]
        public int Height { get; init; }

        /// <summary>
        /// The size in bytes of the linked image.
        /// </summary>
        [Required]
        public long Size { get; init; }

        public ImageLinkModel(string href, int width, int height, long size) : base(href)
        {
            Width = width;
            Height = height;
            Size = size;
        }
    }

    public class CollectionLinkModel : LinkModel
    {
        /// <summary>
        /// The number of items in the linked collection.
        /// </summary>
        [Required]
        public int Count { get; init; }

        public CollectionLinkModel(string href, int count) : base(href)
        {
            Count = count;
        }
    }
}
