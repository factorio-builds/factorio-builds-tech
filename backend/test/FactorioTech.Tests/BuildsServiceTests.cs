using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Configurations;
using DotNet.Testcontainers.Containers;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using FactorioTech.Tests.Helpers;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace FactorioTech.Tests;

public class BuildsServiceTests : IAsyncLifetime
{
    private AppDbContext dbContext = null!;
    private PostgreSqlTestcontainer postgresContainer = null!;
    private BuildService service = null!;

    public async Task InitializeAsync()
    {
        postgresContainer = new TestcontainersBuilder<PostgreSqlTestcontainer>()
            .WithDatabase(new PostgreSqlTestcontainerConfiguration("postgres:latest")
            {
                Database = "postgres",
                Username = "postgres",
                Password = "postgres",
            }).Build();

        await postgresContainer.StartAsync();

        dbContext = AppDbContextFactory.CreateDbContext(postgresContainer.ConnectionString);
        await dbContext.Database.MigrateAsync();

        service = new BuildService(new NullLogger<BuildService>(), dbContext, TestUtils.Tags.Value);
    }

    public async Task DisposeAsync()
    {
        await dbContext.DisposeAsync();
        await postgresContainer.StopAsync();
        await postgresContainer.CleanUpAsync();
        await postgresContainer.DisposeAsync();
    }

    [Fact]
    [Trait("Type", "Slow")]
    public async Task GetBuilds_ShouldReturnSingleBlueprint()
    {
        await new BuildBuilder()
            .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
            .WithOwner()
            .Save(dbContext);

        var (builds, hasMore, totalCount) = await service.GetBuilds(
            (1, 100),
            (BuildService.SortField.Created, BuildService.SortDirection.Asc),
            Array.Empty<string>(),
            null, null, null);

        builds.Should().HaveCount(1);
        hasMore.Should().BeFalse();
        totalCount.Should().Be(1);

        builds.ElementAt(0).Slug.Should().Be("simple-book");
        builds.ElementAt(0).Title.Should().Be("Simple Blueprint Book");
    }

    [Fact]
    [Trait("Type", "Slow")]
    public async Task GetBuilds_ShouldReturnMatchingTags()
    {
        var match1 = await new BuildBuilder()
            .WithOwner()
            .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
            .WithTags("/state/early game", "/power/steam", "/belt/balancer")
            .Save(dbContext);

        var match2 = await new BuildBuilder()
            .WithOwner()
            .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
            .WithTags("/state/mid game", "/power/nuclear", "/belt/balancer")
            .Save(dbContext);

        await new BuildBuilder()
            .WithOwner()
            .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
            .WithTags("/state/late game (megabase)", "/power/solar")
            .Save(dbContext);

        var (builds, hasMore, totalCount) = await service.GetBuilds(
            (1, 100),
            (BuildService.SortField.Created, BuildService.SortDirection.Asc),
            new[] { "/state/early game", "/power/steam", "/belt/balancer" },
            null, null, null);

        builds.Should().HaveCount(2);
        hasMore.Should().BeFalse();
        totalCount.Should().Be(3);

        builds.ElementAt(0).BuildId.Should().Be(match1.BuildId);
        builds.ElementAt(1).BuildId.Should().Be(match2.BuildId);
    }

    [Fact]
    [Trait("Type", "Slow")]
    public async Task GetBuilds_ShouldReturnFirstPageWithMore()
    {
        var match1 = await new BuildBuilder()
            .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
            .WithOwner()
            .Save(dbContext);

        var match2 = await new BuildBuilder()
            .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
            .WithOwner()
            .Save(dbContext);

        await new BuildBuilder()
            .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
            .WithOwner()
            .Save(dbContext);

        await new BuildBuilder()
            .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
            .WithOwner()
            .Save(dbContext);

        await new BuildBuilder()
            .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
            .WithOwner()
            .Save(dbContext);

        var (builds, hasMore, totalCount) = await service.GetBuilds(
            (1, 2),
            (BuildService.SortField.Created, BuildService.SortDirection.Asc),
            Array.Empty<string>(),
            null, null, null);

        builds.Should().HaveCount(2);
        hasMore.Should().BeTrue();
        totalCount.Should().Be(5);

        builds.ElementAt(0).BuildId.Should().Be(match1.BuildId);
        builds.ElementAt(1).BuildId.Should().Be(match2.BuildId);
    }

    [Fact]
    [Trait("Type", "Slow")]
    public async Task GetBuilds_ShouldReturnSecondPage()
    {
        await new BuildBuilder()
            .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
            .WithOwner()
            .Save(dbContext);

        await new BuildBuilder()
            .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
            .WithOwner()
            .Save(dbContext);

        var match1 = await new BuildBuilder()
            .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
            .WithOwner()
            .Save(dbContext);

        var match2 = await new BuildBuilder()
            .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
            .WithOwner()
            .Save(dbContext);

        var (builds, hasMore, totalCount) = await service.GetBuilds(
            (2, 2),
            (BuildService.SortField.Created, BuildService.SortDirection.Asc),
            Array.Empty<string>(),
            null, null, null);

        builds.Should().HaveCount(2);
        hasMore.Should().BeFalse();
        totalCount.Should().Be(4);

        builds.ElementAt(0).BuildId.Should().Be(match1.BuildId);
        builds.ElementAt(1).BuildId.Should().Be(match2.BuildId);
    }

    [Fact]
    [Trait("Type", "Slow")]
    public async Task CreateOrAddVersion_ShouldSaveBlueprintGraph_WhenAddingANewBlueprint()
    {
        var owner = await new UserBuilder().Save(dbContext);
        var payload = await new PayloadBuilder().WithEncoded(TestData.SimpleBookEncoded).Save(dbContext);
        var request = new BuildService.CreateRequest(
            owner.UserName,
            "test-1",
            "test blueprint 1",
            "the description",
            new[] { "/belt/balancer", "/state/early game" },
            (payload.Hash, null, null, Enumerable.Empty<GameIcon>()),
            null);

        var result = await service.CreateOrAddVersion(request, new NullTempCoverHandle(), owner.ToClaimsPrincipal());

        result.Should().BeOfType<BuildService.CreateResult.Success>();

        dbContext.Builds.Should().HaveCount(1);
        dbContext.Payloads.Should().HaveCount(1);
        dbContext.Versions.Should().HaveCount(1);

        var build = ((BuildService.CreateResult.Success)result).Build;
        build.Slug.Should().Be("test-1");
        build.Title.Should().Be("test blueprint 1");
        build.Description.Should().Be("the description");
        build.CreatedAt.ToDateTimeUtc().Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(2));
        build.UpdatedAt.Should().Be(build.CreatedAt);
        build.Tags!.Should().BeEquivalentTo("/belt/balancer", "/state/early game");
    }

    [Fact]
    [Trait("Type", "Slow")]
    public async Task CreateOrAddVersion_ShouldUpdateBlueprintMetadata_WhenAddingAVersion()
    {
        var owner = await new UserBuilder().Save(dbContext);
        var payload = await new PayloadBuilder().WithEncoded(TestData.SimpleBookEncoded).Save(dbContext);
        var existingPayload = await new PayloadBuilder().WithEncoded(TestData.SimpleBlueprintEncoded).Save(dbContext);
        var existing = await new BuildBuilder().WithPayload(existingPayload).WithOwner(owner).Save(dbContext);

        var request = new BuildService.CreateRequest(
            owner.UserName,
            existing.Slug,
            "different title",
            "different description",
            new[] { "/belt/balancer", "/state/mid game", "/production/smelting" },
            (payload.Hash, null, null, Enumerable.Empty<GameIcon>()),
            existing.LatestVersionId);

        var result = await service.CreateOrAddVersion(request, new NullTempCoverHandle(), owner.ToClaimsPrincipal());
        result.Should().BeOfType<BuildService.CreateResult.Success>();

        dbContext.Builds.Should().HaveCount(1);
        dbContext.Payloads.Should().HaveCount(2);
        dbContext.Versions.Should().HaveCount(2);

        var build = ((BuildService.CreateResult.Success)result).Build;
        build.Slug.Should().Be(existing.Slug);
        build.Title.Should().Be("different title");
        build.Description.Should().Be("different description");
        build.UpdatedAt.ToDateTimeUtc().Should().BeAfter(existing.UpdatedAt.ToDateTimeUtc());
        build.Tags!.Should().BeEquivalentTo("/belt/balancer", "/state/mid game", "/production/smelting");
    }
}
