using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Tests.Helpers
{
    public class BlueprintBuilder
    {
        private User? _owner;
        private BlueprintPayload? _payload;

        public BlueprintBuilder WithOwner(User user)
        {
            _owner = user;
            return this;
        }

        public BlueprintBuilder WithPayload(BlueprintPayload payload)
        {
            _payload = payload;
            return this;
        }

        public async Task<Blueprint> Save(AppDbContext dbContext)
        {
            if (_owner == null)
                throw new Exception("Must set owner.");
            if (_payload == null)
                throw new Exception("Must set payload.");

            var request = new BlueprintService.CreateRequest(
                "simple-book",
                "Simple Blueprint Book",
                null,
                new[] { "/belt/balancer", "/general/early game" },
                (_payload.Hash, null, null, Enumerable.Empty<GameIcon>()));

            var service = new BlueprintService(new NullLogger<BlueprintService>(), dbContext);
            var result = await service.CreateOrAddVersion(request, _owner, null);
            result.Should().BeOfType<BlueprintService.CreateResult.Success>("Test data setup failed.");

            dbContext.ClearCache();

            return ((BlueprintService.CreateResult.Success)result).Blueprint;
        }
    }
}
