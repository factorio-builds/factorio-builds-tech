using FactorioTech.Core.Domain;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FactorioTech.Core
{
    public interface IEncodableBlueprint
    {
        ulong Version { get; }
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

            payload = new BlueprintPayload(Hash.Compute(encoded), encoded, Utils.DecodeGameVersion(item.Version));
            TryAdd(item, payload);
            return payload;
        }
    }
}
