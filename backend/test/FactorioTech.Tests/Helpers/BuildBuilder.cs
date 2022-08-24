using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;

namespace FactorioTech.Tests.Helpers;

public class BuildBuilder
{
    private User? owner;
    private UserBuilder? ownerBuilder;
    private Payload? payload;
    private PayloadBuilder? payloadBuilder;
    private IEnumerable<string> tags = new[] { "/belt/balancer", "/state/early game" };

    public BuildBuilder WithOwner(User user)
    {
        ownerBuilder = null;
        owner = user;
        return this;
    }

    public BuildBuilder WithOwner(Action<UserBuilder>? configure = null)
    {
        owner = null;
        ownerBuilder = new UserBuilder();
        configure?.Invoke(ownerBuilder);
        return this;
    }

    public BuildBuilder WithPayload(Payload payload)
    {
        payloadBuilder = null;
        this.payload = payload;
        return this;
    }

    public BuildBuilder WithPayload(Action<PayloadBuilder> configure)
    {
        payload = null;
        payloadBuilder = new PayloadBuilder();
        configure.Invoke(payloadBuilder);
        return this;
    }

    public BuildBuilder WithTags(params string[] tags)
    {
        this.tags = tags;
        return this;
    }

    public async Task<Build> Save(AppDbContext dbContext, bool clearCache = true)
    {
        if (owner == null && ownerBuilder == null)
            throw new Exception("Must set owner.");
        if (payload == null && payloadBuilder == null)
            throw new Exception("Must set payload.");

        owner ??= await ownerBuilder!.Save(dbContext, clearCache: false);
        payload ??= await payloadBuilder!.Save(dbContext, clearCache: false);

        var request = new BuildService.CreateRequest(
            owner.UserName,
            "simple-book",
            "Simple Blueprint Book",
            null,
            tags,
            (payload.Hash, null, null, Enumerable.Empty<GameIcon>()),
            null);

        var service = new BuildService(new NullLogger<BuildService>(), dbContext, TestUtils.Tags.Value);
        var result = await service.CreateOrAddVersion(request, new NullTempCoverHandle(), owner.ToClaimsPrincipal());
        result.Should().BeOfType<BuildService.CreateResult.Success>();

        if (clearCache)
        {
            dbContext.ClearCache();
        }

        return ((BuildService.CreateResult.Success)result).Build;
    }
}
