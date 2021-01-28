using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Tests.Helpers
{
    public class BlueprintBuilder
    {
        private User? _owner;
        private UserBuilder? _ownerBuilder;
        private BlueprintPayload? _payload;
        private PayloadBuilder? _payloadBuilder;
        private IEnumerable<string> _tags = new[] { "/belt/balancer", "/general/early game" };

        public BlueprintBuilder WithOwner(User user)
        {
            _ownerBuilder = null;
            _owner = user;
            return this;
        }

        public BlueprintBuilder WithOwner(Action<UserBuilder>? configure = null)
        {
            _owner = null;
            _ownerBuilder = new UserBuilder();
            configure?.Invoke(_ownerBuilder);
            return this;
        }

        public BlueprintBuilder WithPayload(BlueprintPayload payload)
        {
            _payloadBuilder = null;
            _payload = payload;
            return this;
        }

        public BlueprintBuilder WithPayload(Action<PayloadBuilder> configure)
        {
            _payload = null;
            _payloadBuilder = new PayloadBuilder();
            configure.Invoke(_payloadBuilder);
            return this;
        }
        
        public BlueprintBuilder WithTags(params string[] tags)
        {
            _tags = tags;
            return this;
        }

        public async Task<Blueprint> Save(AppDbContext dbContext, bool clearCache = true)
        {
            if (_owner == null && _ownerBuilder == null)
                throw new Exception("Must set owner.");
            if (_payload == null && _payloadBuilder == null)
                throw new Exception("Must set payload.");

            _owner ??= await _ownerBuilder!.Save(dbContext, clearCache: false);
            _payload ??= await _payloadBuilder!.Save(dbContext, clearCache: false);

            var request = new BuildService.CreateRequest(
                _owner.UserName,
                "simple-book",
                "Simple Blueprint Book",
                null,
                _tags,
                (_payload.Hash, null, null, Enumerable.Empty<GameIcon>()),
                null);

            var service = new BuildService(new NullLogger<BuildService>(), dbContext);
            var result = await service.CreateOrAddVersion(request, new NullTempCoverHandle(), _owner.ToClaimsPrincipal());
            result.Should().BeOfType<BuildService.CreateResult.Success>();

            if (clearCache)
            {
                dbContext.ClearCache();
            }

            return ((BuildService.CreateResult.Success)result).Build;
        }
    }
}
