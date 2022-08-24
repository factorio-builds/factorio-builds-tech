using System.ComponentModel;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace FactorioTech.Core.Domain;

[TypeConverter(typeof(HashConverter))]
public readonly struct Hash
{
    private readonly string value;

    private Hash(string value) => this.value = value;

    public static Hash Empty => new(string.Empty);

    public static Hash Parse(string? value) =>
        TryParse(value, out var hash)
            ? hash
            : throw new ArgumentOutOfRangeException(nameof(value), "The provided input is not a valid hash.");

    public static bool TryParse(string? value, out Hash hash)
    {
        if (value != null && Regex.IsMatch(value, "^[a-f0-9]{32}$", RegexOptions.Compiled))
        {
            hash = new Hash(value);
            return true;
        }
        else
        {
            hash = Empty;
            return false;
        }
    }

    public static Hash Compute(string input) =>
        new(string.Join(string.Empty, MD5.Create()
            .ComputeHash(Encoding.UTF8.GetBytes(input))
            .Select(b => b.ToString("X2".ToLowerInvariant()))));

    public bool Equals(Hash other) => value == other.value;
    public override bool Equals(object? obj) => obj is Hash other && Equals(other);
    public override int GetHashCode() => value.GetHashCode();
    public static bool operator ==(Hash left, Hash right) => left.Equals(right);
    public static bool operator !=(Hash left, Hash right) => !left.Equals(right);
    public static explicit operator Hash(string other) => new(other);
    public static explicit operator string(Hash other) => other.value;
    public override string ToString() => value;

    public sealed class HashConverter : TypeConverter
    {
        public override bool CanConvertFrom(ITypeDescriptorContext? context, Type sourceType) => sourceType == typeof(string);
        public override bool CanConvertTo(ITypeDescriptorContext? context, Type? destinationType) => destinationType == typeof(Hash);

        public override object ConvertFrom(ITypeDescriptorContext? context, CultureInfo? culture, object value) =>
            Parse(value as string ?? value.ToString() ?? throw new ArgumentException(null, nameof(value)));

        public override object ConvertTo(ITypeDescriptorContext? context, CultureInfo? culture, object? value, Type destinationType) =>
            value?.ToString() ?? throw new ArgumentException(null, nameof(value));
    }
}
