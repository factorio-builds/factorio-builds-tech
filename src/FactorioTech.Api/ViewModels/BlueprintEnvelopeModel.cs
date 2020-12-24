using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#pragma warning disable 8618 // Non-nullable property must contain a non-null value when exiting constructor. Consider declaring the property as nullable.

namespace FactorioTech.Api.ViewModels
{
    public class BlueprintEnvelopeModel
    {
        public record Entity(string Type, string Name);

        [Required]
        public string Type { get; set; }

        public string? Label { get; set; }

        public string? Description { get; set; }

        [Required]
        public IEnumerable<Entity> Icons { get; set; }
        
        [Required]
        public IDictionary<string, int> Entities { get; set; }
    }
}
