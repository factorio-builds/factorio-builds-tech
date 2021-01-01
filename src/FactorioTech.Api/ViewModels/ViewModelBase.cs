using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FactorioTech.Api.ViewModels
{
    public record LinkModel(string Href);

    public abstract class ViewModelBase
    {
        [Required]
        [JsonPropertyName("_links")]
        public IReadOnlyDictionary<string, LinkModel> Links { get; init; } = new Dictionary<string, LinkModel>();
    }
}
