using System;
using System.Runtime.CompilerServices;

namespace FactorioTech.Core
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
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static R Let<T, R>(this T v, Func<T, R> f) => f(v);
    }
}
