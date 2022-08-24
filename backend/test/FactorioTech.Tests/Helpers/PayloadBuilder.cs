using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;

namespace FactorioTech.Tests.Helpers;

public class PayloadBuilder
{
    private string encoded = TestData.SimpleBlueprintEncoded;
    private Hash? hash;

    public PayloadBuilder WithEncoded(string encoded)
    {
        this.encoded = encoded;
        return this;
    }

    public PayloadBuilder WithRandomHash()
    {
        hash = Hash.Compute(Guid.NewGuid().ToString());
        return this;
    }

    public async Task<Payload> Save(AppDbContext dbContext, bool clearCache = true)
    {
        var payload = new Payload(
            hash ?? Hash.Compute(encoded),
            PayloadType.Book,
            Version.Parse("1.0.0.0"),
            encoded);

        dbContext.Add(payload);
        await dbContext.SaveChangesAsync();

        if (clearCache)
        {
            dbContext.ClearCache();
        }

        return payload;
    }
}
