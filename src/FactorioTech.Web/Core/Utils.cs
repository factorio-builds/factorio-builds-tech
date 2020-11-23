using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace FactorioTech.Web.Core
{
    public static class Utils
    {
        /// <summary>
        /// Shamelessly stolen from Kotlin
        ///
        ///     inline fun <T, R> T.let(block: (T) -> R): R
        ///
        /// see https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html
        /// </summary>
        public static R Let<T, R>(this T v, Func<T, R> f) => f(v);

        public static string ComputeHash(string input) =>
            string.Join(string.Empty, MD5.Create()
                .ComputeHash(Encoding.UTF8.GetBytes(input))
                .Select(b => b.ToString("X2".ToLowerInvariant())));

        public static string GetWikiUrlForEntity(string key) =>
            $"https://wiki.factorio.com/{GetWikiKeyForEntity(key)}";

        public static string GetWikiKeyForEntity(string key) =>
            key switch
            {
                "small-lamp" => "Lamp",
                "logistic-chest-passive-provider" => "Passive_provider_chest",
                "logistic-chest-active-provider" => "Active_provider_chest",
                "logistic-chest-requester" => "Requester_chest",
                "logistic-chest-buffer" => "Buffer_chest",
                "logistic-chest-storage" => "Storage_chest",
                "stone-wall" => "Wall",
                "straight-rail" => "Rail",
                { } k => k[..1].ToUpperInvariant() + k[1..].Replace("-", "_"),
            };
    }
}
