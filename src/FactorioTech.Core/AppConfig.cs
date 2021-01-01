using NodaTime;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace FactorioTech.Core
{
    public class AppConfig
    {
        public static readonly DateTimeZone DefaultTimeZone = DateTimeZoneProviders.Tzdb["Europe/Berlin"];

        public static class Cover
        {
            public const int Width = 480;
            public const int Height = 480;
        }

        public static class Rendering
        {
            public const int MaxWidth = 1440;
            public const int MaxHeight = 1440;
        }

        public static class Policies
        {
            public static class Slug
            {
                public const int MinimumLength = 3;
                public const int MaximumLength = 100;
                public const string AllowedCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
                public const string AllowedCharactersRegex = "[a-zA-Z0-9_-]+";
                public const string AllowedCharactersErrorMessage = "Only latin characters (a-z and A-Z), digits (0-9), underscore (_) and hyphen (-) are allowed.";
                public static IReadOnlySet<string> Blocklist = new HashSet<string> { "account", "admin", "administrator", "delete", "edit", "import", "raw" };
            }
        }

        public Uri BlueprintEditorUri { get; init; } = new("https://teoxoy.github.io/factorio-blueprint-editor");
        public Uri FbsrWrapperUri { get; init; } = new("http://localhost:8080");
        public Uri FrontendUri { get; init; } = new("http://localhost:3000");
        public Uri ApiUri { get; init; } = new("https://localhost:5101");
        public Uri IdentityUri { get; init; } = new("https://localhost:5001");
        public string DataDir { get; init; } = Path.Join(GetLocalVolumesDir(), GetAppShortName(), "data");
        public string ProtectedDataDir { get; init; } = Path.Join(GetLocalVolumesDir(), GetAppShortName(), "protected");
        public string FactorioDir { get; init; } = Path.Join(GetLocalVolumesDir(), "factorio");

        public Uri SeedDataUri { get; init; } = new("https://gist.githubusercontent.com/dstockhammer/7a6daae8992cd287a6f433e155ef8e9c/raw/seed.json");
        public bool AlwaysDownloadSeedData = true;

        private static string GetLocalVolumesDir() =>
            Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "../../.local/volumes"));

        private static string GetAppShortName() =>
            Assembly.GetEntryAssembly()?.GetName().Name?.Split('.').Last().ToLowerInvariant()
            ?? throw new Exception("Failed to determine entry assembly");
    }
}
