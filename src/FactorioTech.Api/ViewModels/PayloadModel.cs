using System.Collections.Generic;
using System.Linq;

namespace FactorioTech.Api.ViewModels
{
    public class PayloadModel
    {
        public string Hash { get; set; }
        public string GameVersion { get; set; }
        public string Encoded { get; set; }
        public BlueprintEnvelopeModel Blueprint { get; set; }
        public IEnumerable<PayloadModel> Children { get; set; } = Enumerable.Empty<PayloadModel>();
    }
}
