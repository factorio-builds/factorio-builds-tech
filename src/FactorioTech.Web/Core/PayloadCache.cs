using FactorioTech.Web.Core.Domain;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FactorioTech.Web.Core
{
    public interface IEncodableBlueprint
    {
    }

    public sealed class PayloadCache : Dictionary<IEncodableBlueprint, BlueprintPayload>
    {
        public async Task<BlueprintPayload> EnsureInitialized(IEncodableBlueprint item)
        {
            if (TryGetValue(item, out var payload))
                return payload;

            var converter = new BlueprintConverter();
            var encoded = item switch
            {
                FactorioApi.Blueprint blueprint => await converter.Encode(blueprint),
                FactorioApi.BlueprintBook book => await converter.Encode(book),
                FactorioApi.BlueprintEnvelope envelope => await converter.Encode(envelope),
                _ => throw new Exception("Invalid item type"),
            };

            payload = new BlueprintPayload(Hash.Compute(encoded), encoded);
            TryAdd(item, payload);
            return payload;
        }
    }
}
