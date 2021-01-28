using DotNet.Testcontainers.Containers.Builders;
using DotNet.Testcontainers.Containers.Configurations.Databases;
using DotNet.Testcontainers.Containers.Modules.Databases;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using FactorioTech.Tests.Helpers;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace FactorioTech.Tests
{
    public class BlueprintServiceTests : IAsyncLifetime
    {
        private AppDbContext _dbContext = null!;
        private PostgreSqlTestcontainer _postgresContainer = null!;
        private BuildService _service = null!;

        public async Task InitializeAsync()
        {
            _postgresContainer = new TestcontainersBuilder<PostgreSqlTestcontainer>()
                .WithDatabase(new PostgreSqlTestcontainerConfiguration("postgres:latest")
                {
                    Database = "postgres",
                    Username = "postgres",
                    Password = "postgres",
                }).Build();

            await _postgresContainer.StartAsync();

            _dbContext = AppDbContextFactory.CreateDbContext(_postgresContainer.ConnectionString);
            await _dbContext.Database.MigrateAsync();

            _service = new BuildService(new NullLogger<BuildService>(), _dbContext);
        }

        public async Task DisposeAsync()
        {
            await _dbContext.DisposeAsync();
            await _postgresContainer.StopAsync();
            await _postgresContainer.CleanUpAsync();
            await _postgresContainer.DisposeAsync();
        }

        [Fact]
        [Trait("Type", "Slow")]
        public async Task GetBlueprints_ShouldReturnSingleBlueprint()
        {
            await new BlueprintBuilder()
                .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
                .WithOwner()
                .Save(_dbContext);

            var (blueprints, hasMore, totalCount) = await _service.GetBuilds(
                (1, 100),
                (BuildService.SortField.Created, BuildService.SortDirection.Asc),
                Array.Empty<string>(),
                null, null, null);

            blueprints.Should().HaveCount(1);
            hasMore.Should().BeFalse();
            totalCount.Should().Be(1);

            blueprints.ElementAt(0).Slug.Should().Be("simple-book");
            blueprints.ElementAt(0).Title.Should().Be("Simple Blueprint Book");
        }

        [Fact]
        [Trait("Type", "Slow")]
        public async Task GetBlueprints_ShouldReturnMatchingTags()
        {
            var match1 = await new BlueprintBuilder()
                .WithOwner()
                .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
                .WithTags("/general/early game", "/power/steam", "/belt/balancer")
                .Save(_dbContext);

            var match2 = await new BlueprintBuilder()
                .WithOwner()
                .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
                .WithTags("/general/mid game", "/power/nuclear", "/belt/balancer")
                .Save(_dbContext);

            await new BlueprintBuilder()
                .WithOwner()
                .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
                .WithTags("/general/late game (megabase)", "/power/solar")
                .Save(_dbContext);

            var (blueprints, hasMore, totalCount) = await _service.GetBuilds(
                (1, 100),
                (BuildService.SortField.Created, BuildService.SortDirection.Asc),
                new[] { "/general/early game", "/power/steam", "/belt/balancer" },
                null, null, null);

            blueprints.Should().HaveCount(2);
            hasMore.Should().BeFalse();
            totalCount.Should().Be(3);

            blueprints.ElementAt(0).BlueprintId.Should().Be(match1.BlueprintId);
            blueprints.ElementAt(1).BlueprintId.Should().Be(match2.BlueprintId);
        }

        [Fact]
        [Trait("Type", "Slow")]
        public async Task GetBlueprints_ShouldReturnFirstPageWithMore()
        {
            var match1 = await new BlueprintBuilder()
                .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
                .WithOwner()
                .Save(_dbContext);

            var match2 = await new BlueprintBuilder()
                .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
                .WithOwner()
                .Save(_dbContext);

            await new BlueprintBuilder()
                .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
                .WithOwner()
                .Save(_dbContext);

            await new BlueprintBuilder()
                .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
                .WithOwner()
                .Save(_dbContext);

            await new BlueprintBuilder()
                .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
                .WithOwner()
                .Save(_dbContext);

            var (blueprints, hasMore, totalCount) = await _service.GetBuilds(
                (1, 2),
                (BuildService.SortField.Created, BuildService.SortDirection.Asc),
                Array.Empty<string>(),
                null, null, null);

            blueprints.Should().HaveCount(2);
            hasMore.Should().BeTrue();
            totalCount.Should().Be(5);

            blueprints.ElementAt(0).BlueprintId.Should().Be(match1.BlueprintId);
            blueprints.ElementAt(1).BlueprintId.Should().Be(match2.BlueprintId);
        }

        [Fact]
        [Trait("Type", "Slow")]
        public async Task GetBlueprints_ShouldReturnSecondPage()
        {
            await new BlueprintBuilder()
                .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
                .WithOwner()
                .Save(_dbContext);

            await new BlueprintBuilder()
                .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
                .WithOwner()
                .Save(_dbContext);

            var match1 = await new BlueprintBuilder()
                .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
                .WithOwner()
                .Save(_dbContext);

            var match2 = await new BlueprintBuilder()
                .WithPayload(b => b.WithEncoded(TestData.SimpleBlueprintEncoded).WithRandomHash())
                .WithOwner()
                .Save(_dbContext);

            var (blueprints, hasMore, totalCount) = await _service.GetBuilds(
                (2, 2),
                (BuildService.SortField.Created, BuildService.SortDirection.Asc),
                Array.Empty<string>(),
                null, null, null);

            blueprints.Should().HaveCount(2);
            hasMore.Should().BeFalse();
            totalCount.Should().Be(4);

            blueprints.ElementAt(0).BlueprintId.Should().Be(match1.BlueprintId);
            blueprints.ElementAt(1).BlueprintId.Should().Be(match2.BlueprintId);
        }

        [Fact]
        [Trait("Type", "Slow")]
        public async Task CreateOrAddVersion_ShouldSaveBlueprintGraph_WhenAddingANewBlueprint()
        {
            var owner = await new UserBuilder().Save(_dbContext);
            var payload = await new PayloadBuilder().WithEncoded(TestData.SimpleBookEncoded).Save(_dbContext);
            var request = new BuildService.CreateRequest(
                owner.UserName,
                "test-1",
                "test blueprint 1",
                "the description",
                new[] { "/belt/balancer", "/general/early game" },
                (payload.Hash, null, null, Enumerable.Empty<GameIcon>()),
                null);

            var result = await _service.CreateOrAddVersion(request, new NullTempCoverHandle(), owner.ToClaimsPrincipal());

            result.Should().BeOfType<BuildService.CreateResult.Success>();

            _dbContext.Blueprints.Should().HaveCount(1);
            _dbContext.BlueprintPayloads.Should().HaveCount(1);
            _dbContext.BlueprintVersions.Should().HaveCount(1);

            var blueprint = ((BuildService.CreateResult.Success)result).Build;
            blueprint.Slug.Should().Be("test-1");
            blueprint.Title.Should().Be("test blueprint 1");
            blueprint.Description.Should().Be("the description");
            blueprint.CreatedAt.ToDateTimeUtc().Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(2));
            blueprint.UpdatedAt.Should().Be(blueprint.CreatedAt);
            blueprint.Tags!.Should().BeEquivalentTo("/belt/balancer", "/general/early game");
        }

        [Fact]
        [Trait("Type", "Slow")]
        public async Task CreateOrAddVersion_ShouldUpdateBlueprintMetadata_WhenAddingAVersion()
        {
            var owner = await new UserBuilder().Save(_dbContext);
            var payload = await new PayloadBuilder().WithEncoded(TestData.SimpleBookEncoded).Save(_dbContext);
            var existingPayload = await new PayloadBuilder().WithEncoded(TestData.SimpleBlueprintEncoded).Save(_dbContext);
            var existing = await new BlueprintBuilder().WithPayload(existingPayload).WithOwner(owner).Save(_dbContext);

            var request = new BuildService.CreateRequest(
                owner.UserName,
                existing.Slug,
                "different title",
                "different description",
                new[] { "/belt/balancer", "/general/mid game", "/mods/vanilla" },
                (payload.Hash, null, null, Enumerable.Empty<GameIcon>()),
                existing.LatestVersionId);

            var result = await _service.CreateOrAddVersion(request, new NullTempCoverHandle(), owner.ToClaimsPrincipal());
            result.Should().BeOfType<BuildService.CreateResult.Success>();

            _dbContext.Blueprints.Should().HaveCount(1);
            _dbContext.BlueprintPayloads.Should().HaveCount(2);
            _dbContext.BlueprintVersions.Should().HaveCount(2);

            var blueprint = ((BuildService.CreateResult.Success)result).Build;
            blueprint.Slug.Should().Be(existing.Slug);
            blueprint.Title.Should().Be("different title");
            blueprint.Description.Should().Be("different description");
            blueprint.UpdatedAt.ToDateTimeUtc().Should().BeAfter(existing.UpdatedAt.ToDateTimeUtc());
            blueprint.Tags!.Should().BeEquivalentTo("/belt/balancer", "/general/mid game", "/mods/vanilla");
        }
    }
}
