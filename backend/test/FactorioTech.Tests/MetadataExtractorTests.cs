using FactorioTech.Core.Services;
using FactorioTech.Tests.Helpers;
using FluentAssertions;
using System;
using System.Threading.Tasks;
using Xunit;

namespace FactorioTech.Tests
{
    public class MetadataExtractorTests
    {
        [Theory]
        [Trait("Type", "Fast")]
        [InlineData(nameof(TestData.HighThroughputTrainStation), "/train/track")]
        [InlineData(nameof(TestData.RobotsSpeedModulesFactory), "/general/beaconized")]
        [InlineData(nameof(TestData.MarkedInputModulesPurpleScience), "/general/beaconized", "???", Skip = "not implemented yet")]
        public async Task ExtractsTags(string name, params string[] expected)
        {
            var encoded = typeof(TestData).GetField(name)?.GetRawConstantValue()?.ToString();
            if (encoded == null)
                throw new ArgumentException($"The blueprint name must be a const in {nameof(TestData)}", nameof(name));

            var extractor = new MetadataExtractor();
            var envelope = await new BlueprintConverter().Decode(encoded);

            var result = extractor.ExtractTags(envelope.Blueprint!);

            result.Should().BeEquivalentTo(expected);
        }
    }
}
