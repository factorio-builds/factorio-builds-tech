using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FactorioTech.Core
{
    public interface IEncodableBlueprint
    {
        ulong Version { get; }
        string Item { get; }
    }

    public sealed class PayloadCache : Dictionary<IEncodableBlueprint, BlueprintPayload>
    {
        public async Task<BlueprintPayload> EnsureInitialized(IEncodableBlueprint item)
        {
            if (TryGetValue(item, out var payload))
            {
                TryAddFirstChild(item as FactorioApi.BlueprintEnvelope, payload);
                return payload;
            }

            var converter = new BlueprintConverter();
            var encoded = item switch
            {
                FactorioApi.Blueprint bp => await converter.Encode(bp),
                FactorioApi.BlueprintBook bb => await converter.Encode(bb),
                FactorioApi.BlueprintEnvelope e => await converter.Encode(e),
                _ => throw new Exception("Invalid item type"),
            };

            payload = new BlueprintPayload(
                Hash.Compute(encoded),
                converter.ParseType(item.Item),
                converter.DecodeGameVersion(item.Version),
                encoded);

            TryAdd(item, payload);
            TryAddFirstChild(item as FactorioApi.BlueprintEnvelope, payload);
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
