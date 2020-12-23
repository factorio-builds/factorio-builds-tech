using System.Collections.Generic;

namespace FactorioTech.Api.ViewModels
{
    public class BlueprintEnvelopeModel
    {
        public record Entity(string Type, string Name);

        public string Type { get; set; }
        public string Label { get; set; }
        public string Description { get; set; }
        public IEnumerable<Entity> Icons { get; set; }
        public IEnumerable<Entity> Entities { get; set; }
    }
}
