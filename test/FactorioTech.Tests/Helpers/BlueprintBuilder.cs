using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using System;
using System.Threading.Tasks;

namespace FactorioTech.Tests.Helpers
{
    public class BlueprintBuilder
    {
        private User? _owner;

        public BlueprintBuilder WithOwner(User user)
        {
            _owner = user;
            return this;
        }

        public async Task<Blueprint> Save(AppDbContext dbContext)
        {
            if (_owner == null)
                throw new Exception("Must set owner.");

            var request = new BlueprintService.CreateRequest(
                "simple-book",
                "Simple Blueprint Book",
                null,
                new[] { "/belt/balancer", "/general/early game" },
                (null, null));

            var payload = new BlueprintPayload(
                Hash.Compute(TestData.SimpleBookEncoded),
                TestData.SimpleBookEncoded,
                Utils.DecodeGameVersion(TestData.SimpleBook.Version));

            var service = new BlueprintService(new NullLogger<BlueprintService>(), dbContext, null!, null!);
            var result = await service.CreateOrAddVersion(request, payload, (_owner.Id, _owner.UserName), null);
            result.Should().BeOfType<BlueprintService.CreateResult.Success>("Test data setup failed.");

            dbContext.ClearCache();

            return ((BlueprintService.CreateResult.Success)result).Blueprint;
        }
    }
}
