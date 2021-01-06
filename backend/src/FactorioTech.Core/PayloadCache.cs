using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FactorioTech.Core
{
    public sealed class PayloadCache : Dictionary<FactorioApi.IBlueprint, BlueprintPayload>
    {
        public async Task<BlueprintPayload> EnsureInitialized(FactorioApi.IBlueprint blueprint)
        {
            if (TryGetValue(blueprint, out var payload))
            {
                TryAddFirstChild(blueprint as FactorioApi.BlueprintEnvelope, payload);
                return payload;
            }

            var converter = new BlueprintConverter();
            var encoded = await converter.Encode(blueprint);

            payload = new BlueprintPayload(
                Hash.Compute(encoded),
                converter.ParseType(blueprint.Item),
                converter.DecodeGameVersion(blueprint.Version),
                encoded);

            TryAdd(blueprint, payload);
            TryAddFirstChild(blueprint as FactorioApi.BlueprintEnvelope, payload);
            return payload;
        }

        public async Task EnsureInitializedGraph(FactorioApi.BlueprintEnvelope envelope)
        {
            await EnsureInitialized(envelope);

            if (envelope.BlueprintBook?.Blueprints != null)
            {
                foreach (var inner in envelope.BlueprintBook.Blueprints)
                {
                    await EnsureInitializedGraph(inner);
                }
            }
        }

        private bool TryAddFirstChild(FactorioApi.BlueprintEnvelope? envelope, BlueprintPayload payload)
        {
            if (envelope?.Blueprint != null)
            {
                return TryAdd(envelope.Blueprint, payload);
            }

            if (envelope?.BlueprintBook != null)
            {
                return TryAdd(envelope.BlueprintBook, payload);
            }

            return false;
        }
    }
}
