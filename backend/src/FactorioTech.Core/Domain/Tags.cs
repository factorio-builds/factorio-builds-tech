using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace FactorioTech.Core.Domain
{
    [DebuggerStepThrough]
    public static class Tags
    {
        // from https://github.com/FactorioBlueprints/factorio-prints/blob/master/data/tags.json
        private static IReadOnlyDictionary<string, IEnumerable<string>> _data => new Dictionary<string, IEnumerable<string>>
        {
            {
                "belt", new[]
                {
                    "balancer",
                    "prioritizer",
                    "tap",
                    "transport belt (yellow)",
                    "fast transport belt (red)",
                    "express transport belt (blue)",
                }
            },
            {
                "general", new[]
                {
                    "early game",
                    "mid game",
                    "late game (megabase)",
                    "beaconized",
                    "tileable",
                    "compact",
                    "marathon",
                    "storage",
                }
            },
            {
                "mods", new[]
                {
                    "angels",
                    "bobs",
                    "creative",
                    "factorissimo",
                    "warehousing",
                    "lighted-electric-poles",
                    "other",
                    "vanilla",
                }
            },
            {
                "power", new[]
                {
                    "nuclear",
                    "kovarex enrichment",
                    "solar",
                    "steam",
                    "accumulator",
                }
            },
            {
                "production", new[]
                {
                    "oil processing",
                    "coal liquification",
                    "electronic circuit (green)",
                    "advanced circuit (red)",
                    "processing unit (blue)",
                    "batteries",
                    "rocket parts",
                    "science",
                    "research (labs)",
                    "belts",
                    "smelting",
                    "mining",
                    "uranium",
                    "plastic",
                    "modules",
                    "mall (make everything)",
                    "inserters",
                    "guns and ammo",
                    "robots",
                    "other",
                    "belt based",
                    "logistic (bot) based",
                }
            },
            {
                "train", new[]
                {
                    "loading station",
                    "unloading station",
                    "pax",
                    "junction",
                    "roundabout",
                    "crossing",
                    "stacker",
                    "track",
                    "left-hand-drive",
                    "right-hand-drive",
                }
            },
            {
                "circuit", new[]
                {
                    "indicator",
                    "counter",
                }
            },
        };

        private static readonly Lazy<IEnumerable<string>> _flattenedData =
            new(() => _data.SelectMany(kvp => kvp.Value.Select(tag => $"/{kvp.Key}/{tag}")));

        public static IEnumerable<string> All => _flattenedData.Value;
    }
}
