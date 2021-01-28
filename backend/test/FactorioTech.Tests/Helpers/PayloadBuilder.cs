using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using System;
using System.Threading.Tasks;

namespace FactorioTech.Tests.Helpers
{
    public class PayloadBuilder
    {
        private string _encoded = TestData.SimpleBlueprintEncoded;
        private Hash? _hash;

        public PayloadBuilder WithEncoded(string encoded)
        {
            _encoded = encoded;
            return this;
        }

        public PayloadBuilder WithRandomHash()
        {
            _hash = Hash.Compute(Guid.NewGuid().ToString());
            return this;
        }

        public async Task<BlueprintPayload> Save(AppDbContext dbContext, bool clearCache = true)
        {
            var payload = new BlueprintPayload(
                _hash ?? Hash.Compute(_encoded),
                BlueprintType.Book,
                Version.Parse("1.0.0.0"),
                _encoded);

            dbContext.Add(payload);
            await dbContext.SaveChangesAsync();

            if (clearCache)
            {
                dbContext.ClearCache();
            }

            return payload;
        }
    }
}
