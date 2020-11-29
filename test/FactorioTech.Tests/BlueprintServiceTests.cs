using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging.Abstractions;
using NodaTime;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace FactorioTech.Tests
{
    public class BlueprintServiceTests
    {
        private readonly BlueprintService _service;
        private readonly AppDbContext _dbContext;

        public BlueprintServiceTests()
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning));

            _dbContext = new AppDbContext(optionsBuilder.Options);

            if (_dbContext.Database.IsRelational())
            {
                _dbContext.Database.Migrate();
            }

            _service = new BlueprintService(new NullLogger<BlueprintService>(), _dbContext);
        }

        [Fact]
        public async Task DummyGetTest()
        {
            var now = SystemClock.Instance.GetCurrentInstant();
            var bp = new Blueprint(
                Guid.NewGuid(),
                (Guid.NewGuid(), "test-user-1"),
                now, now,
                "test-1",
                Tags.All.Take(2).Select(Tag.FromString),
                "test blueprint 1",
                null);

            _dbContext.Add(bp);
            await _dbContext.SaveChangesAsync();

            var blueprints = await _service.GetBlueprints((1, 100), ("created", "asc"), Array.Empty<string>(), null);
            blueprints.Should().HaveCount(1);
        }

        [Fact]
        public async Task DummySaveTest()
        {
            var request = new BlueprintService.CreateRequest(
                "test-1",
                "test blueprint 1",
                null,
                Tags.All.Take(2),
                (null, null));

            var payload = new BlueprintPayload(
                Hash.Compute(TestData.SimpleBookEncoded),
                TestData.SimpleBookEncoded,
                Utils.DecodeGameVersion(TestData.SimpleBook.Version));

            var result = await _service.CreateOrAddVersion(request, payload, (Guid.NewGuid(), "test-user-1"), null);

            result.Should().BeOfType<BlueprintService.CreateResult.Success>();

            _dbContext.Blueprints.Should().HaveCount(1);
            _dbContext.BlueprintPayloads.Should().HaveCount(1);
            _dbContext.BlueprintVersions.Should().HaveCount(1);
        }
    }
}
