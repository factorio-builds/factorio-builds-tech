using FactorioTech.Core;
using FactorioTech.Core.Services;
using FactorioTech.Tests.Helpers;
using FluentAssertions;
using Xunit;
using Xunit.Abstractions;

namespace FactorioTech.Tests;

public class BlueprintConverterTests
{
    private readonly ITestOutputHelper output;

    public BlueprintConverterTests(ITestOutputHelper output) => this.output = output;

    [Theory]
    [Trait("Type", "Fast")]
    [InlineData(64424902656, "0.15.6.0")]
    [InlineData(64425099264, "0.15.9.0")]
    [InlineData(68722819072, "0.16.51.0")]
    [InlineData(281474976710656, "1.0.0.0")]
    public void ParseVersion(ulong encoded, string expected)
    {
        var converter = new BlueprintConverter();
        converter.DecodeGameVersion(encoded).Should().Be(Version.Parse(expected));
    }

    [Fact]
    [Trait("Type", "Fast")]
    public async Task SimpleBlueprintIsDecoded()
    {
        var converter = new BlueprintConverter();
        var result = await converter.Decode(TestData.SimpleBlueprintEncoded);

        result.Blueprint.Should().BeEquivalentTo(TestData.SimpleBlueprint, config =>
            config.Excluding(x => x.Type == typeof(Dictionary<string, object>)));
        result.BlueprintBook.Should().BeNull();

        result.Entity.Item.Should().Be(TestData.SimpleBlueprint.Item);
        result.Entity.Label.Should().Be(TestData.SimpleBlueprint.Label);
        result.Entity.Description.Should().Be(TestData.SimpleBlueprint.Description);
        result.Entity.Icons.Should().BeEquivalentTo(TestData.SimpleBlueprint.Icons);
    }

    [Fact]
    [Trait("Type", "Fast")]
    public async Task SimpleBlueprintBookIsDecoded()
    {
        var converter = new BlueprintConverter();
        var result = await converter.Decode(TestData.SimpleBookEncoded);

        result.Blueprint.Should().BeNull();
        result.BlueprintBook.Should().BeEquivalentTo(TestData.SimpleBook, config =>
            config.Excluding(x => x.Type == typeof(Dictionary<string, object>)));

        result.Entity.Item.Should().Be(TestData.SimpleBook.Item);
        result.Entity.Label.Should().Be(TestData.SimpleBook.Label);
        result.Entity.Description.Should().Be(TestData.SimpleBook.Description);
        result.Entity.Icons.Should().BeEquivalentTo(TestData.SimpleBook.Icons);
    }

    [Fact]
    [Trait("Type", "Fast")]
    public async Task AdvancedBlueprintBookIsDecoded()
    {
        var converter = new BlueprintConverter();
        var result = await converter.Decode(TestData.AdvancedBookEncoded);

        result.Blueprint.Should().BeNull();
        result.BlueprintBook.Should().BeEquivalentTo(TestData.AdvancedBook, config =>
            config.Excluding(x => x.Type == typeof(Dictionary<string, object>)));

        result.Entity.Item.Should().Be(TestData.AdvancedBook.Item);
        result.Entity.Label.Should().Be(TestData.AdvancedBook.Label);
        result.Entity.Description.Should().Be(TestData.AdvancedBook.Description);
        result.Entity.Icons.Should().BeEquivalentTo(TestData.AdvancedBook.Icons);
    }

    [Fact]
    [Trait("Type", "Fast")]
    public async Task SimpleBlueprintIsEncoded()
    {
        var converter = new BlueprintConverter();
        var encoded = await converter.Encode(new FactorioApi.BlueprintEnvelope
        {
            Blueprint = TestData.SimpleBlueprint,
        });

        output.WriteLine($"Encoded blueprint string:\n{encoded}");

        var allowance = (uint)Math.Floor(TestData.SimpleBlueprintEncoded.Length * 0.05);
        encoded.Length.Should().BeCloseTo(TestData.SimpleBlueprintEncoded.Length, allowance);

        var result = await converter.Decode(encoded);
        result.Blueprint.Should().BeEquivalentTo(TestData.SimpleBlueprint, config =>
            config.Excluding(x => x.Type == typeof(Dictionary<string, object>)));
    }

    [Fact]
    [Trait("Type", "Fast")]
    public async Task SimpleBlueprintBookIsEncoded()
    {
        var converter = new BlueprintConverter();
        var encoded = await converter.Encode(new FactorioApi.BlueprintEnvelope
        {
            BlueprintBook = TestData.SimpleBook,
        });

        output.WriteLine($"Encoded blueprint string:\n{encoded}");

        var allowance = (uint)Math.Floor(TestData.SimpleBookEncoded.Length * 0.05);
        encoded.Length.Should().BeCloseTo(TestData.SimpleBookEncoded.Length, allowance);

        var result = await converter.Decode(encoded);
        result.BlueprintBook.Should().BeEquivalentTo(TestData.SimpleBook, config =>
            config.Excluding(x => x.Type == typeof(Dictionary<string, object>)));
    }

    [Fact]
    [Trait("Type", "Fast")]
    public async Task AdvancedBlueprintBookIsEncoded()
    {
        var converter = new BlueprintConverter();
        var encoded = await converter.Encode(new FactorioApi.BlueprintEnvelope
        {
            BlueprintBook = TestData.AdvancedBook,
        });

        output.WriteLine($"Encoded blueprint string:\n{encoded}");

        var allowance = (uint)Math.Floor(TestData.AdvancedBookEncoded.Length * 0.05);
        encoded.Length.Should().BeCloseTo(TestData.AdvancedBookEncoded.Length, allowance);

        var result = await converter.Decode(encoded);
        result.BlueprintBook.Should().BeEquivalentTo(TestData.AdvancedBook, config =>
            config.Excluding(x => x.Type == typeof(Dictionary<string, object>)));
    }

    [Fact]
    [Trait("Type", "Fast")]
    public async Task EnvelopeIsEncodedWithoutIndex()
    {
        var converter = new BlueprintConverter();
        var envelope = await converter.Decode(TestData.SolarBook);

        envelope.Index.Should().BeNull();

        foreach (var blueprint in envelope.BlueprintBook!.Blueprints!)
        {
            blueprint.Index.Should().NotBeNull();
            blueprint.Entity.Label.Should().NotBeNull();

            var encoded = await converter.Encode(blueprint);
            var decoded = await converter.Decode(encoded);

            decoded.Index.Should().BeNull();
            decoded.Entity.Label.Should().Be(blueprint.Entity.Label);
        }
    }
}
