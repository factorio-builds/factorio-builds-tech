using NodaTime;
using System;

namespace FactorioTech.Core
{
    public class AppConfig
    {
        public static readonly DateTimeZone DefaulTimeZone = DateTimeZoneProviders.Tzdb["Europe/Berlin"];

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

        public Uri FbsrWrapperUri { get; init; } = new("http://localhost:8080");
        public string WorkingDir { get; init; } = string.Empty;
        public string FactorioDir { get; init; } = string.Empty;
    }
}
