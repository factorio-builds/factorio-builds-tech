using NodaTime;
using System;

namespace FactorioTech.Core
{
    public class AppConfig
    {
        public static readonly DateTimeZone DefaulTimeZone = DateTimeZoneProviders.Tzdb["Europe/Berlin"];

        public Uri FbsrWrapperUri { get; init; } = new("http://localhost:8080");
        public string WorkingDir { get; init; } = string.Empty;
        public string FactorioDir { get; init; } = string.Empty;
    }
}
