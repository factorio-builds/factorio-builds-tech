using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using System;
using System.Threading.Tasks;

namespace FactorioTech.Tests.Helpers
{
    public class PayloadBuilder
    {
        private string _encoded = TestData.SimpleBlueprintEncoded;

        public PayloadBuilder WithEncoded(string encoded)
        {
            _encoded = encoded;
            return this;
        }

        public async Task<BlueprintPayload> Save(AppDbContext dbContext)
        {
            var payload = new BlueprintPayload(Hash.Compute(_encoded), _encoded, Version.Parse("1.0.0.0"));

            dbContext.Add(payload);
            await dbContext.SaveChangesAsync();
            dbContext.ClearCache();
            return payload;
        }
    }
}
