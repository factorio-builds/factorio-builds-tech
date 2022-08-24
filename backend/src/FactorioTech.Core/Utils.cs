using FactorioTech.Core.Domain;
using System.Runtime.CompilerServices;

namespace FactorioTech.Core;

public static class Utils
{
    /// <summary>
    /// Shamelessly stolen from Kotlin
    ///
    ///     inline fun <T, R> T.let(block: (T) -> R): R
    ///
    /// see https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html
    /// </summary>
    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static TR Let<T, TR>(this T v, Func<T, TR> f) => f(v);

    public static IEnumerable<GameIcon> ToGameIcons(this IEnumerable<FactorioApi.Icon>? icons) =>
        icons?.OrderBy(i => i.Index)
            .Select(i => new GameIcon(Enum.Parse<IconType>(i.Signal.Type, true), i.Signal.Name))
        ?? Enumerable.Empty<GameIcon>();

    public static IReadOnlyDictionary<string, int> ToItemStats(this IEnumerable<FactorioApi.Item>? items) =>
        items?.GroupBy(e => e.Name)
            .OrderByDescending(g => g.Count())
            .ToDictionary(g => g.Key.ToLowerInvariant(), g => g.Count())
        ?? new Dictionary<string, int>(0);
}
