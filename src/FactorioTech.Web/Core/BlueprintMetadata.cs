using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FactorioTech.Web.Core
{
    public interface ICanHaveMetadata
    {
    }

    public sealed class BlueprintMetadata
    {
        public string Encoded { get; }
        public string Hash { get; }

        public BlueprintMetadata(string encoded, string hash)
        {
            Encoded = encoded;
            Hash = hash;
        }
    }

    public sealed class BlueprintMetadataCache : Dictionary<ICanHaveMetadata, BlueprintMetadata>
    {
        public async Task EnsureInitialized(ICanHaveMetadata? item)
        {
            if (item != null && !ContainsKey(item))
            {
                var converter = new BlueprintConverter();
                var encoded = item switch
                {
                    FactorioApi.Blueprint blueprint => await converter.Encode(blueprint),
                    FactorioApi.BlueprintBook book => await converter.Encode(book),
                    FactorioApi.BlueprintEnvelope envelope => await converter.Encode(envelope),
                    _ => throw new Exception("Invalid item type"),
                };

                var metadata = new BlueprintMetadata(encoded, Utils.ComputeHash(encoded));
                TryAdd(item, metadata);
            }
        }
    }
}
