using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#pragma warning disable 8618 // Non-nullable property must contain a non-null value when exiting constructor. Consider declaring the property as nullable.

namespace FactorioTech.Api.ViewModels
{
    public class PayloadModel
    {
        [Required]
        public string Hash { get; set; }

        [Required]
        public string GameVersion { get; set; }

        [Required]
        public string Encoded { get; set; }
        
        [Required]
        public BlueprintEnvelopeModel Blueprint { get; set; }

        public IEnumerable<PayloadModel>? Children { get; set; }
    }
}
