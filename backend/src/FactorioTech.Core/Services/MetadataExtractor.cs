using System.Collections.Generic;
using System.Linq;

namespace FactorioTech.Core.Services
{
    public class MetadataExtractor
    {
        private static readonly HashSet<string> TrainEntities = new(new[]
        {
            "straight-rail",
            "curved-rail",
            "train-stop",
            "rail-signal",
            "rail-chain-signal",
        });

        public IEnumerable<string> ExtractTags(FactorioApi.Blueprint blueprint)
        {
            if (ContainsTrains(blueprint))
            {
                yield return "/train/track";
            }

            if (ContainsBeacons(blueprint))
            {
                yield return "/general/beaconized";
            }
        }

        private bool ContainsTrains(FactorioApi.Blueprint blueprint) =>
            blueprint.Entities.Any(e => TrainEntities.Contains(e.Name));

        private bool ContainsBeacons(FactorioApi.Blueprint blueprint) =>
            blueprint.Entities.Any(e => e.Name == "beacon");

        private bool ContainsMarkedInputs(FactorioApi.Blueprint blueprint) =>
            // todo: implement this?
            // entity.name === "constant-combinator" &&
            // entity.control_behavior?.filters.some((filter) => {
            //     return filter.signal.type === "item"
            // })
            false;
    }
}
