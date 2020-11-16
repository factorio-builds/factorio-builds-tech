using FactorioTech.Web.Core;
using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;

namespace FactorioTech.Tests
{
    public class BlueprintConverterTests
    {
        private readonly ITestOutputHelper _output;

        public BlueprintConverterTests(ITestOutputHelper output)
        {
            _output = output;
        }

        [Fact]
        public async Task SimpleBlueprintIsEncoded()
        {
            var converter = new BlueprintConverter(new NullLogger<BlueprintConverter>());
            var encoded = await converter.Encode(TestData.SimpleBlueprint);
            _output.WriteLine($"Encoded blueprint string:\n{encoded}");

            var result = await converter.Decode(encoded);

            result.Value.Should().BeOfType<FactorioApi.Blueprint>();
            result.AsT0.Should().BeEquivalentTo(TestData.SimpleBlueprint, options =>
                options.ComparingByMembers<FactorioApi.Blueprint>()
            );
        }

        [Fact]
        public async Task SimpleBlueprintBookIsEncoded()
        {
            var converter = new BlueprintConverter(new NullLogger<BlueprintConverter>());
            var encoded = await converter.Encode(TestData.SimpleBook);
            _output.WriteLine($"Encoded blueprint string:\n{encoded}");

            var result = await converter.Decode(encoded);

            result.Value.Should().BeOfType<FactorioApi.BlueprintBook>();
            result.AsT1.Should().BeEquivalentTo(TestData.SimpleBook, options => options
                .ComparingByMembers<FactorioApi.Blueprint>()
                .ComparingByMembers<FactorioApi.BlueprintBook>()
                .ComparingByMembers<FactorioApi.BookItem>()
            );
        }

        [Fact]
        public async Task SimpleBlueprintIsDecoded()
        {
            var converter = new BlueprintConverter(new NullLogger<BlueprintConverter>());
            var result = await converter.Decode(TestData.SimpleBlueprintEncoded);

            result.Value.Should().BeOfType<FactorioApi.Blueprint>();
            result.AsT0.Should().BeEquivalentTo(TestData.SimpleBlueprint, options =>
                options.ComparingByMembers<FactorioApi.Blueprint>()
            );
        }

        [Fact]
        public async Task SimpleBlueprintBookIsDecoded()
        {
            var service = new BlueprintConverter(new NullLogger<BlueprintConverter>());
            var result = await service.Decode(TestData.SimpleBookEncoded);

            result.Value.Should().BeOfType<FactorioApi.BlueprintBook>();
            result.AsT1.Should().BeEquivalentTo(TestData.SimpleBook, options => options
                .ComparingByMembers<FactorioApi.Blueprint>()
                .ComparingByMembers<FactorioApi.BlueprintBook>()
                .ComparingByMembers<FactorioApi.BookItem>()
            );
        }

        private static class TestData
        {
            public const string SimpleBlueprintEncoded = "0eNqllMtugzAQRX8FzRqiQszLyyy77bKqKh6jaiTbWLapghD/XhOkNEpJ04adx56553r8GKEWPWpDygEfoUXbGNKOOgUcnnvrgiqwJLXA4Jy4gxCo6ZQF/jqCpQ9VibnYDRp9FTmUPkNVco7wqA1aGzlTKas746IahYPJS6gWj8DjKbwrYjW1aJzxrr4Lk+ktBFSOHOFi5RQM76qXNRqvfM9ECLqztGx2hNlLud+lIQzAi3nkWS0ZbJaMZDZ6hUgeQCT/Q+wfQLDbCLaCYGeExJZ6GaHw6YaaSHcCf2+TR00rkummxqTrotmmA02vW5GtIPJNvm80o9h0hH/yXW5CsJ+3xL+t0xvkFx9ECKLyYn7uZfkSDhdLn2jscomLmOWszLM8fsrSbJq+AEDWdWo=";
            public const string SimpleBookEncoded = "0eNqlVE1vwjAM/SuVzy2ipR/QI8ddd5wm1A+LWUuTKEkZCPW/L2k1QKzARm9xbL/37MQ+QslalIq42ZRCfEJ+PN9oyN8uTOerUVeKpCHBIYeXVhuv8DQ1kqF3CpyBD1QJPuRr2vKCuWRzkGizyGBjI3jROAv3UqHWgVEF11IoE5TIDHQWgte4hzzs/IcgWlKNyiir6pwYde8+IDdkCAcpvXHY8LYpUVnkRyJ8kELTUOwRnJbVYpb4cIB86U6WqyaF1RAROaFXFNETFNH/KBZPUMS3KeIRivhE0WBNbRMgs+GKqkAKhvfbZKm6EchkUmOScdB00oMm161IRyiySbpvNGM56Qn/pHs1iSL+/UvsbPUzmF8sCB9YYcHs3euwEtYXrh0qPXziZRhn8SpLs3CeJul5YOdjoEG/lm4je+vB/6fN5Dkw74vMR+/k26fX1ujGCV0BhW3RDjc/Nd0pvPsGs+rVjQ==";

            public static readonly FactorioApi.Blueprint SimpleBlueprint = new ()
            {
                Item = "blueprint",
                Label = "Simple Blueprint",
                Description = "Just a simple blueprint.",
                Version = 281474976710656,
                Icons = new FactorioApi.Icon[]
                {
                    new ()
                    {
                        Index = 1,
                        Signal = new FactorioApi.SignalId { Type = "item", Name = "express-transport-belt" },
                    },
                    new ()
                    {
                        Index = 2, Signal = new FactorioApi.SignalId { Type = "item", Name = "spidertron" },
                    },
                },
                Entities = new FactorioApi.Entity[]
                {
                    new ()
                    {
                        EntityNumber = 1,
                        Name = "express-transport-belt",
                        Position = new FactorioApi.Position { X = 193.5f, Y = 893.5f },
                        Direction = 2,
                    },
                    new ()
                    {
                        EntityNumber = 2,
                        Name = "express-transport-belt",
                        Position = new FactorioApi.Position { X = 192.5f, Y = 893.5f },
                        Direction = 2,
                    },
                    new ()
                    {
                        EntityNumber = 3,
                        Name = "express-transport-belt",
                        Position = new FactorioApi.Position { X = 194.5f, Y = 893.5f },
                        Direction = 4,
                    },
                    new ()
                    {
                        EntityNumber = 4,
                        Name = "medium-electric-pole",
                        Position = new FactorioApi.Position { X = 193.5f, Y = 894.5f },
                    },
                    new ()
                    {
                        EntityNumber = 5,
                        Name = "express-transport-belt",
                        Position = new FactorioApi.Position { X = 192.5f, Y = 895.5f },
                    },
                    new ()
                    {
                        EntityNumber = 6,
                        Name = "express-transport-belt",
                        Position = new FactorioApi.Position { X = 193.5f, Y = 895.5f },
                        Direction = 6,
                    },
                    new ()
                    {
                        EntityNumber = 7,
                        Name = "express-transport-belt",
                        Position = new FactorioApi.Position { X = 192.5f, Y = 894.5f },
                    },
                    new ()
                    {
                        EntityNumber = 8,
                        Name = "express-transport-belt",
                        Position = new FactorioApi.Position { X = 194.5f, Y = 895.5f },
                        Direction = 6,
                    },
                    new ()
                    {
                        EntityNumber = 9,
                        Name = "express-transport-belt",
                        Position = new FactorioApi.Position { X = 194.5f, Y = 894.5f },
                        Direction = 4,
                    },
                },
            };

            public static readonly FactorioApi.BlueprintBook SimpleBook = new ()
            {
                Item = "blueprint-book",
                Label = "Simple Blueprint Book",
                ActiveIndex = 0,
                Version = 281474976710656,
                Blueprints = new FactorioApi.BookItem[] { new() { Index = 0, Blueprint = SimpleBlueprint } },
            };
        }
    }
}
