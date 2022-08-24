using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;

namespace FactorioTech.Core;

public sealed class PayloadCache : Dictionary<FactorioApi.BlueprintEnvelope, Payload>
{
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

    public async Task<Payload> EnsureInitialized(FactorioApi.BlueprintEnvelope envelope)
    {
        if (TryGetValue(envelope, out var payload))
        {
            return payload;
        }

        var converter = new BlueprintConverter();
        var encoded = await converter.Encode(envelope);

        payload = new Payload(
            Hash.Compute(encoded),
            converter.ParseType(envelope.Entity.Item),
            converter.DecodeGameVersion(envelope.Entity.Version),
            encoded);

        TryAdd(envelope, payload);
        return payload;
    }
}