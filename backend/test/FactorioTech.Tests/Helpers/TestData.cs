using FactorioTech.Core;

namespace FactorioTech.Tests.Helpers;

public static class TestData
{
    public const string SimpleBlueprintEncoded = "0eNqllMtugzAQRX8FzRqiQszLyyy77bKqKh6jaiTbWLapghD/XhOkNEpJ04adx56553r8GKEWPWpDygEfoUXbGNKOOgUcnnvrgiqwJLXA4Jy4gxCo6ZQF/jqCpQ9VibnYDRp9FTmUPkNVco7wqA1aGzlTKas746IahYPJS6gWj8DjKbwrYjW1aJzxrr4Lk+ktBFSOHOFi5RQM76qXNRqvfM9ECLqztGx2hNlLud+lIQzAi3nkWS0ZbJaMZDZ6hUgeQCT/Q+wfQLDbCLaCYGeExJZ6GaHw6YaaSHcCf2+TR00rkummxqTrotmmA02vW5GtIPJNvm80o9h0hH/yXW5CsJ+3xL+t0xvkFx9ECKLyYn7uZfkSDhdLn2jscomLmOWszLM8fsrSbJq+AEDWdWo=";
    public const string SimpleBookEncoded = "0eNqlVE1vwjAM/SuVzy2ipR/QI8ddd5wm1A+LWUuTKEkZCPW/L2k1QKzARm9xbL/37MQ+QslalIq42ZRCfEJ+PN9oyN8uTOerUVeKpCHBIYeXVhuv8DQ1kqF3CpyBD1QJPuRr2vKCuWRzkGizyGBjI3jROAv3UqHWgVEF11IoE5TIDHQWgte4hzzs/IcgWlKNyiir6pwYde8+IDdkCAcpvXHY8LYpUVnkRyJ8kELTUOwRnJbVYpb4cIB86U6WqyaF1RAROaFXFNETFNH/KBZPUMS3KeIRivhE0WBNbRMgs+GKqkAKhvfbZKm6EchkUmOScdB00oMm161IRyiySbpvNGM56Qn/pHs1iSL+/UvsbPUzmF8sCB9YYcHs3euwEtYXrh0qPXziZRhn8SpLs3CeJul5YOdjoEG/lm4je+vB/6fN5Dkw74vMR+/k26fX1ujGCV0BhW3RDjc/Nd0pvPsGs+rVjQ==";
    public const string AdvancedBookEncoded = "0eNrtVMtuwjAQ/JXI5wRByANyK8dee6wqlMcKVk1sy3Z4COXfaycqRBBKIJcecrO9uzOza3tOJMlL4AKpWieMfZPodDmRJPpsbU0sA5kK5AoZJRF5L6WyYktiwXOwzokTYhNMGW3qJW5onJtideSgq1BBoTNoXJgdHLgAKR0lYio5E8pJIFek0hA0gwOJZpX9EERyzEAooVVdCt3qyyZAFSqERkq9Oa5pWSQgNPIjETbhTGLT7IkYLcv5xLfJkUQLs9JcGQpImwzXCL2icF+gcJ+jmL9A4d2n8DoovDNFARmWhQO5TheYOpzl8PeYNFXVAekPGozfDRoMulD/ehRBB0U4SPedYSwGXWEv3ctBFN7tK9F/q/6DUcsgbJLHGkyffTSWsGqFdiBk84gXMy/0lmEQzqaBH1w+7NToHv1o9KPRj0Y/+hd+1AHq1LZ0H9laNfFezmQZMGuPalsH6eZl2+p0nJlpINYj2sH6t6c+jYd9Gn/LdjFNIbttvbdozvYgHKn7T7ct2d5zsqsfSpSWWQ==";
    public const string SolarBook = "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";

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
                Position = new FactorioApi.Position { X = 193.5f, Y = 893.5f },
                ExtensionData = new()
                {
                    { "entity_number", 1 },
                    { "direction", 2 },
                },
            },
            new()
            {
                Name = "express-transport-belt",
                Position = new FactorioApi.Position { X = 192.5f, Y = 893.5f },
                ExtensionData = new()
                {
                    { "entity_number", 2 },
                    { "direction", 2 },
                },
            },
            new()
            {
                Name = "express-transport-belt",
                Position = new FactorioApi.Position { X = 194.5f, Y = 893.5f },
                ExtensionData = new()
                {
                    { "entity_number", 3 },
                    { "direction", 4 },
                },
            },
            new()
            {
                Name = "medium-electric-pole",
                Position = new FactorioApi.Position { X = 193.5f, Y = 894.5f },
                ExtensionData = new()
                {
                    { "entity_number", 4 },
                },
            },
            new()
            {
                Name = "express-transport-belt",
                Position = new FactorioApi.Position { X = 192.5f, Y = 895.5f },
                ExtensionData = new()
                {
                    { "entity_number", 5 },
                },
            },
            new()
            {
                Name = "express-transport-belt",
                Position = new FactorioApi.Position { X = 193.5f, Y = 895.5f },
                ExtensionData = new()
                {
                    { "entity_number", 6 },
                    { "direction", 6 },
                },
            },
            new()
            {
                Name = "express-transport-belt",
                Position = new FactorioApi.Position { X = 192.5f, Y = 894.5f },
                ExtensionData = new()
                {
                    { "entity_number", 7 },
                },
            },
            new()
            {
                Name = "express-transport-belt",
                Position = new FactorioApi.Position { X = 194.5f, Y = 895.5f },
                ExtensionData = new()
                {
                    { "entity_number", 8 },
                    { "direction", 6 },
                },
            },
            new()
            {
                Name = "express-transport-belt",
                Position = new FactorioApi.Position { X = 194.5f, Y = 894.5f },
                ExtensionData = new()
                {
                    { "entity_number", 9 },
                    { "direction", 4 },
                },
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
        },
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
        },
    };
}