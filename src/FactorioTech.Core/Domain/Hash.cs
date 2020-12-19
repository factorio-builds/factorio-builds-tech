using Newtonsoft.Json;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace FactorioTech.Core.Domain
{
    [JsonConverter(typeof(HashConverter))]
    public readonly struct Hash
    {
        private readonly string _value;

        public Hash(string value) => _value = value;

        public static Hash Empty => new(string.Empty);

        public static Hash Parse(string value) =>
            Regex.IsMatch(value, "^[a-f0-9]{32}$", RegexOptions.Compiled)
                ? new Hash(value)
                : throw new ArgumentOutOfRangeException(nameof(value), "The provided input is not a valid hash.");

        public static Hash Compute(string input) =>
            new(string.Join(string.Empty, MD5.Create()
                .ComputeHash(Encoding.UTF8.GetBytes(input))
                .Select(b => b.ToString("X2".ToLowerInvariant()))));

        public bool Equals(Hash other) => _value == other._value;
        public override bool Equals(object? obj) => obj is Hash other && Equals(other);
        public override int GetHashCode() => _value.GetHashCode();
        public static bool operator ==(Hash left, Hash right) => left.Equals(right);
        public static bool operator !=(Hash left, Hash right) => !left.Equals(right);
        public static explicit operator Hash(string other) => new(other);
        public static explicit operator string(Hash other) => other._value;
        public override string ToString() => _value;
    }

    // MassTransit still uses Newtonsoft.Json so we need this...
    public class HashConverter : JsonConverter<Hash>
    {
        public override Hash ReadJson(JsonReader reader, Type objectType, Hash existingValue, bool hasExistingValue, JsonSerializer serializer) =>
            new((string)reader.Value);

        public override void WriteJson(JsonWriter writer, Hash value, JsonSerializer serializer) =>
            writer.WriteValue(value.ToString());
    }
}
