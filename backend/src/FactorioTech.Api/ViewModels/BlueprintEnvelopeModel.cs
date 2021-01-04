using FactorioTech.Core.Domain;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace FactorioTech.Api.ViewModels
{
    public class BlueprintEnvelopeModel
    {
        public string? Label { get; set; }

        public string? Description { get; set; }

        [Required]
        public IEnumerable<GameIcon> Icons { get; set; } = Enumerable.Empty<GameIcon>();

        [Required]
        public IDictionary<string, int> Entities { get; set; } = new Dictionary<string, int>();
    }
}
