using FactorioTech.Core;
using System.Collections.Generic;

namespace FactorioTech.Tests.Helpers
{
    public static class TestData
    {
        public const string SimpleBlueprintEncoded = "0eNqllMtugzAQRX8FzRqiQszLyyy77bKqKh6jaiTbWLapghD/XhOkNEpJ04adx56553r8GKEWPWpDygEfoUXbGNKOOgUcnnvrgiqwJLXA4Jy4gxCo6ZQF/jqCpQ9VibnYDRp9FTmUPkNVco7wqA1aGzlTKas746IahYPJS6gWj8DjKbwrYjW1aJzxrr4Lk+ktBFSOHOFi5RQM76qXNRqvfM9ECLqztGx2hNlLud+lIQzAi3nkWS0ZbJaMZDZ6hUgeQCT/Q+wfQLDbCLaCYGeExJZ6GaHw6YaaSHcCf2+TR00rkummxqTrotmmA02vW5GtIPJNvm80o9h0hH/yXW5CsJ+3xL+t0xvkFx9ECKLyYn7uZfkSDhdLn2jscomLmOWszLM8fsrSbJq+AEDWdWo=";
        public const string SimpleBookEncoded = "0eNqlVE1vwjAM/SuVzy2ipR/QI8ddd5wm1A+LWUuTKEkZCPW/L2k1QKzARm9xbL/37MQ+QslalIq42ZRCfEJ+PN9oyN8uTOerUVeKpCHBIYeXVhuv8DQ1kqF3CpyBD1QJPuRr2vKCuWRzkGizyGBjI3jROAv3UqHWgVEF11IoE5TIDHQWgte4hzzs/IcgWlKNyiir6pwYde8+IDdkCAcpvXHY8LYpUVnkRyJ8kELTUOwRnJbVYpb4cIB86U6WqyaF1RAROaFXFNETFNH/KBZPUMS3KeIRivhE0WBNbRMgs+GKqkAKhvfbZKm6EchkUmOScdB00oMm161IRyiySbpvNGM56Qn/pHs1iSL+/UvsbPUzmF8sCB9YYcHs3euwEtYXrh0qPXziZRhn8SpLs3CeJul5YOdjoEG/lm4je+vB/6fN5Dkw74vMR+/k26fX1ujGCV0BhW3RDjc/Nd0pvPsGs+rVjQ==";
        public const string AdvancedBookEncoded = "0eNrtVMtuwjAQ/JXI5wRByANyK8dee6wqlMcKVk1sy3Z4COXfaycqRBBKIJcecrO9uzOza3tOJMlL4AKpWieMfZPodDmRJPpsbU0sA5kK5AoZJRF5L6WyYktiwXOwzokTYhNMGW3qJW5onJtideSgq1BBoTNoXJgdHLgAKR0lYio5E8pJIFek0hA0gwOJZpX9EERyzEAooVVdCt3qyyZAFSqERkq9Oa5pWSQgNPIjETbhTGLT7IkYLcv5xLfJkUQLs9JcGQpImwzXCL2icF+gcJ+jmL9A4d2n8DoovDNFARmWhQO5TheYOpzl8PeYNFXVAekPGozfDRoMulD/ehRBB0U4SPedYSwGXWEv3ctBFN7tK9F/q/6DUcsgbJLHGkyffTSWsGqFdiBk84gXMy/0lmEQzqaBH1w+7NToHv1o9KPRj0Y/+hd+1AHq1LZ0H9laNfFezmQZMGuPalsH6eZl2+p0nJlpINYj2sH6t6c+jYd9Gn/LdjFNIbttvbdozvYgHKn7T7ct2d5zsqsfSpSWWQ==";

        public static readonly FactorioApi.Blueprint SimpleBlueprint = new()
        {
            Item = "blueprint",
            Label = "Simple Blueprint",
            Description = "Just a simple blueprint.",
            Version = 281474976710656,
            Icons = new FactorioApi.Icon[]
            {
                new()
                {
                    Index = 1,
                    Signal = new FactorioApi.SignalId { Type = "item", Name = "express-transport-belt" },
                },
                new()
                {
                    Index = 2,
                    Signal = new FactorioApi.SignalId { Type = "item", Name = "spidertron" },
                },
            },
            Entities = new FactorioApi.Entity[]
            {
                new()
                {
                    Name = "express-transport-belt",
                    ExtensionData = new()
                    {
                        { "entity_number", 1 },
                        { "direction", 2 },
                        { "position", new Dictionary<string, object>
                        {
                            { "x",  193.5f }, { "y", 893.5f }
                        } }
                    }
                },
                new()
                {
                    Name = "express-transport-belt",
                    ExtensionData = new()
                    {
                        { "entity_number", 2 },
                        { "direction", 2 },
                        { "position", new Dictionary<string, object>
                        {
                            { "x",  192.5f }, { "y", 893.5f }
                        } }
                    }
                },
                new()
                {
                    Name = "express-transport-belt",
                    ExtensionData = new()
                    {
                        { "entity_number", 3 },
                        { "direction", 4 },
                        { "position", new Dictionary<string, object>
                        {
                            { "x",  194.5f }, { "y", 893.5f }
                        } }
                    }
                },
                new()
                {
                    Name = "medium-electric-pole",
                    ExtensionData = new()
                    {
                        { "entity_number", 4 },
                        { "position", new Dictionary<string, object>
                        {
                            { "x",  193.5f }, { "y", 894.5f }
                        } }
                    }
                },
                new()
                {
                    Name = "express-transport-belt",
                    ExtensionData = new()
                    {
                        { "entity_number", 5 },
                        { "position", new Dictionary<string, object>
                        {
                            { "x",  192.5f }, { "y", 895.5f }
                        } }
                    }
                },
                new()
                {
                    Name = "express-transport-belt",
                    ExtensionData = new()
                    {
                        { "entity_number", 6 },
                        { "direction", 6 },
                        { "position", new Dictionary<string, object>
                        {
                            { "x",  193.5f }, { "y", 895.5f }
                        } }
                    }
                },
                new()
                {
                    Name = "express-transport-belt",
                    ExtensionData = new()
                    {
                        { "entity_number", 7 },
                        { "position", new Dictionary<string, object>
                        {
                            { "x",  192.5f }, { "y", 894.5f }
                        } }
                    }
                },
                new()
                {
                    Name = "express-transport-belt",
                    ExtensionData = new()
                    {
                        { "entity_number", 8 },
                        { "direction", 6 },
                        { "position", new Dictionary<string, object>
                        {
                            { "x",  194.5f }, { "y", 895.5f }
                        } }
                    }
                },
                new()
                {
                    Name = "express-transport-belt",
                    ExtensionData = new()
                    {
                        { "entity_number", 9 },
                        { "direction", 4 },
                        { "position", new Dictionary<string, object>
                        {
                            { "x",  194.5f }, { "y", 894.5f }
                        } }
                    }
                },
            },
        };

        public static readonly FactorioApi.BlueprintBook SimpleBook = new()
        {
            Item = "blueprint-book",
            Label = "Simple Blueprint Book",
            Description = "Just a simple blueprint book with a single blueprint.",
            Version = 281474976710656,
            Blueprints = new FactorioApi.BlueprintEnvelope[]
            {
                new() { Index = 0, Blueprint = SimpleBlueprint },
            },
            Icons = new FactorioApi.Icon[]
            {
                new()
                {
                    Index = 1,
                    Signal = new FactorioApi.SignalId { Type = "item", Name = "spidertron" },
                },
            },
            ExtensionData = new()
            {
                { "active_index", 0 },
            }
        };

        public static readonly FactorioApi.BlueprintBook AdvancedBook = new()
        {
            Item = "blueprint-book",
            Label = "Advanced Blueprint Book",
            Version = 281474976710656,
            Blueprints = new FactorioApi.BlueprintEnvelope[]
            {
                new() { Index = 0, Blueprint = SimpleBlueprint },
                new() { Index = 7, BlueprintBook = SimpleBook },
            },
            Icons = new FactorioApi.Icon[]
            {
                new()
                {
                    Index = 4,
                    Signal = new FactorioApi.SignalId { Type = "item", Name = "power-switch" },
                },
            },
            ExtensionData = new()
            {
                { "active_index", 0 },
            }
        };
    }
}
