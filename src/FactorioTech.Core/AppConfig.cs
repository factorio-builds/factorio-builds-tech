using NodaTime;
using System;
using System.Collections.Generic;

namespace FactorioTech.Core
{
    public class AppConfig
    {
        public static Uri BlueprintEditorUri = new("https://teoxoy.github.io/factorio-blueprint-editor");
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

        public Uri FbsrWrapperUri { get; init; } = new("http://localhost:8080");
        public string WorkingDir { get; init; } = string.Empty;
        public string FactorioDir { get; init; } = string.Empty;
    }
}
