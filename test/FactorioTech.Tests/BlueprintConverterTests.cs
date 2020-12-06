using FactorioTech.Core;
using FactorioTech.Tests.Helpers;
using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;

namespace FactorioTech.Tests
{
    public class BlueprintConverterTests
    {
        private readonly ITestOutputHelper _output;

        public BlueprintConverterTests(ITestOutputHelper output) => _output = output;

        [Theory]
        [InlineData(64424902656, "0.15.6.0")]
        [InlineData(64425099264, "0.15.9.0")]
        [InlineData(68722819072, "0.16.51.0")]
        [InlineData(281474976710656, "1.0.0.0")]
        public void ParseVersion(ulong encoded, string expected)
        {
            Utils.DecodeGameVersion(encoded).Should().Be(Version.Parse(expected));
        }

        [Fact]
        [Trait("Type", "Fast")]
        public async Task SimpleBlueprintIsDecoded()
        {
            var converter = new BlueprintConverter();
            var result = await converter.Decode(TestData.SimpleBlueprintEncoded);

            result.Blueprint.Should().BeEquivalentTo(TestData.SimpleBlueprint, config =>
                config.Excluding(x => x.CompileTimeType == typeof(Dictionary<string, object>)));
            result.BlueprintBook.Should().BeNull();

            result.Item.Should().Be(TestData.SimpleBlueprint.Item);
            result.Label.Should().Be(TestData.SimpleBlueprint.Label);
            result.Description.Should().Be(TestData.SimpleBlueprint.Description);
            result.Icons.Should().BeEquivalentTo(TestData.SimpleBlueprint.Icons);
        }

        [Fact]
        [Trait("Type", "Fast")]
        public async Task SimpleBlueprintBookIsDecoded()
        {
            var converter = new BlueprintConverter();
            var result = await converter.Decode(TestData.SimpleBookEncoded);

            result.Blueprint.Should().BeNull();
            result.BlueprintBook.Should().BeEquivalentTo(TestData.SimpleBook, config =>
                config.Excluding(x => x.CompileTimeType == typeof(Dictionary<string, object>)));

            result.Item.Should().Be(TestData.SimpleBook.Item);
            result.Label.Should().Be(TestData.SimpleBook.Label);
            result.Description.Should().Be(TestData.SimpleBook.Description);
            result.Icons.Should().BeEquivalentTo(TestData.SimpleBook.Icons);
        }

        [Fact]
        [Trait("Type", "Fast")]
        public async Task AdvancedBlueprintBookIsDecoded()
        {
            var converter = new BlueprintConverter();
            var result = await converter.Decode(TestData.AdvancedBookEncoded);

            result.Blueprint.Should().BeNull();
            result.BlueprintBook.Should().BeEquivalentTo(TestData.AdvancedBook, config =>
                config.Excluding(x => x.CompileTimeType == typeof(Dictionary<string, object>)));

            result.Item.Should().Be(TestData.AdvancedBook.Item);
            result.Label.Should().Be(TestData.AdvancedBook.Label);
            result.Description.Should().Be(TestData.AdvancedBook.Description);
            result.Icons.Should().BeEquivalentTo(TestData.AdvancedBook.Icons);
        }

        [Fact]
        [Trait("Type", "Fast")]
        public async Task SimpleBlueprintIsEncoded()
        {
            var converter = new BlueprintConverter();
            var encoded = await converter.Encode(TestData.SimpleBlueprint);
            _output.WriteLine($"Encoded blueprint string:\n{encoded}");

            var allowance = (uint)Math.Floor(TestData.SimpleBlueprintEncoded.Length * 0.05);
            encoded.Length.Should().BeCloseTo(TestData.SimpleBlueprintEncoded.Length, allowance);

            var result = await converter.Decode(encoded);
            result.Blueprint.Should().BeEquivalentTo(TestData.SimpleBlueprint, config =>
                config.Excluding(x => x.CompileTimeType == typeof(Dictionary<string, object>)));
        }

        [Fact]
        [Trait("Type", "Fast")]
        public async Task SimpleBlueprintBookIsEncoded()
        {
            var converter = new BlueprintConverter();
            var encoded = await converter.Encode(TestData.SimpleBook);
            _output.WriteLine($"Encoded blueprint string:\n{encoded}");

            var allowance = (uint)Math.Floor(TestData.SimpleBookEncoded.Length * 0.05);
            encoded.Length.Should().BeCloseTo(TestData.SimpleBookEncoded.Length, allowance);

            var result = await converter.Decode(encoded);
            result.BlueprintBook.Should().BeEquivalentTo(TestData.SimpleBook, config =>
                config.Excluding(x => x.CompileTimeType == typeof(Dictionary<string, object>)));
        }

        [Fact]
        [Trait("Type", "Fast")]
        public async Task AdvancedBlueprintBookIsEncoded()
        {
            var converter = new BlueprintConverter();
            var encoded = await converter.Encode(TestData.AdvancedBook);
            _output.WriteLine($"Encoded blueprint string:\n{encoded}");

            var allowance = (uint)Math.Floor(TestData.AdvancedBookEncoded.Length * 0.05);
            encoded.Length.Should().BeCloseTo(TestData.AdvancedBookEncoded.Length, allowance);

            var result = await converter.Decode(encoded);
            result.BlueprintBook.Should().BeEquivalentTo(TestData.AdvancedBook, config =>
                config.Excluding(x => x.CompileTimeType == typeof(Dictionary<string, object>)));
        }
    }
}
