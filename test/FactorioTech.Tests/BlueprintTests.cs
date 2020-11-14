using FactorioTech.Web.Core;
using FluentAssertions;
using System.Threading.Tasks;
using Xunit;

namespace FactorioTech.Tests
{
    public class BlueprintTests
    {
        [Fact]
        public async Task SimpleBlueprint()
        {
            var blueprint = "0eNqllMtugzAQRX8FzRqiQszLyyy77bKqKh6jaiTbWLapghD/XhOkNEpJ04adx56553r8GKEWPWpDygEfoUXbGNKOOgUcnnvrgiqwJLXA4Jy4gxCo6ZQF/jqCpQ9VibnYDRp9FTmUPkNVco7wqA1aGzlTKas746IahYPJS6gWj8DjKbwrYjW1aJzxrr4Lk+ktBFSOHOFi5RQM76qXNRqvfM9ECLqztGx2hNlLud+lIQzAi3nkWS0ZbJaMZDZ6hUgeQCT/Q+wfQLDbCLaCYGeExJZ6GaHw6YaaSHcCf2+TR00rkummxqTrotmmA02vW5GtIPJNvm80o9h0hH/yXW5CsJ+3xL+t0xvkFx9ECKLyYn7uZfkSDhdLn2jscomLmOWszLM8fsrSbJq+AEDWdWo=";

            var converter = new BlueprintConverter();
            var result = await converter.FromString(blueprint);

            result.Should().NotBeNull();
            result!.Blueprint.Should().NotBeNull();
            result.Blueprint.Label.Should().Be("Simple Blueprint");
            result.Blueprint.Description.Should().Be("Just a simple blueprint.");
            result.Blueprint.Item.Should().Be("blueprint");
            result.Blueprint.Version.Should().Be(281474976710656);

            result.Blueprint.Icons.Should().ContainInOrder(
                new Icon
                {
                    Index = 1,
                    Signal = new SignalId
                    {
                        Type = "item",
                        Name = "express-transport-belt",
                    }
                },
                new Icon
                {
                    Index = 2,
                    Signal = new SignalId
                    {
                        Type = "item",
                        Name = "spidertron",
                    }
                }
            );

            result.Blueprint.Entities.Should().ContainInOrder(
                new Entity
                {
                    EntityNumber = 1,
                    Name = "express-transport-belt",
                    Position = new Position { X = 193.5f, Y = 893.5f },
                    Direction = 2,
                },
                new Entity
                {
                    EntityNumber = 2,
                    Name = "express-transport-belt",
                    Position = new Position { X = 192.5f, Y = 893.5f },
                    Direction = 2,
                },
                new Entity
                {
                    EntityNumber = 3,
                    Name = "express-transport-belt",
                    Position = new Position { X = 194.5f, Y = 893.5f },
                    Direction = 4,
                },
                new Entity
                {
                    EntityNumber = 4,
                    Name = "medium-electric-pole",
                    Position = new Position { X = 193.5f, Y = 894.5f },
                },
                new Entity
                {
                    EntityNumber = 5,
                    Name = "express-transport-belt",
                    Position = new Position { X = 192.5f, Y = 895.5f },
                },
                new Entity
                {
                    EntityNumber = 6,
                    Name = "express-transport-belt",
                    Position = new Position { X = 193.5f, Y = 895.5f },
                    Direction = 6,
                },
                new Entity
                {
                    EntityNumber = 7,
                    Name = "express-transport-belt",
                    Position = new Position { X = 192.5f, Y = 894.5f },
                },
                new Entity
                {
                    EntityNumber = 8,
                    Name = "express-transport-belt",
                    Position = new Position { X = 194.5f, Y = 895.5f },
                    Direction = 6,
                },
                new Entity
                {
                    EntityNumber = 9,
                    Name = "express-transport-belt",
                    Position = new Position { X = 194.5f, Y = 894.5f },
                    Direction = 4,
                }
            );
        }

        [Fact]
        public async Task SimpleBlueprintBook()
        {
            var blueprint = "0eNqlVE1vwjAM/SuVzy2ipR/QI8ddd5wm1A+LWUuTKEkZCPW/L2k1QKzARm9xbL/37MQ+QslalIq42ZRCfEJ+PN9oyN8uTOerUVeKpCHBIYeXVhuv8DQ1kqF3CpyBD1QJPuRr2vKCuWRzkGizyGBjI3jROAv3UqHWgVEF11IoE5TIDHQWgte4hzzs/IcgWlKNyiir6pwYde8+IDdkCAcpvXHY8LYpUVnkRyJ8kELTUOwRnJbVYpb4cIB86U6WqyaF1RAROaFXFNETFNH/KBZPUMS3KeIRivhE0WBNbRMgs+GKqkAKhvfbZKm6EchkUmOScdB00oMm161IRyiySbpvNGM56Qn/pHs1iSL+/UvsbPUzmF8sCB9YYcHs3euwEtYXrh0qPXziZRhn8SpLs3CeJul5YOdjoEG/lm4je+vB/6fN5Dkw74vMR+/k26fX1ujGCV0BhW3RDjc/Nd0pvPsGs+rVjQ==";

            var service = new BlueprintConverter();
            var result = await service.FromString(blueprint);

            result.Should().NotBeNull();
        }
    }
}
