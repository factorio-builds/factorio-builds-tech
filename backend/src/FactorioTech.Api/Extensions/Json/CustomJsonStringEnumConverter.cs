using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FactorioTech.Api.Extensions.Json
{
    /// <summary>
    /// Workaround for System.Text.Json not supporting custom enum conversion (yet).
    /// See https://github.com/dotnet/runtime/issues/31081
    /// Code taken from https://stackoverflow.com/a/59061296
    /// </summary>
    public class CustomJsonStringEnumConverter : JsonConverterFactory
    {
        private readonly JsonNamingPolicy? _namingPolicy;
        private readonly bool _allowIntegerValues;
        private readonly JsonStringEnumConverter _baseConverter;

        public CustomJsonStringEnumConverter() : this(null, true) { }

        public CustomJsonStringEnumConverter(JsonNamingPolicy? namingPolicy = null, bool allowIntegerValues = true)
        {
            _namingPolicy = namingPolicy;
            _allowIntegerValues = allowIntegerValues;
            _baseConverter = new JsonStringEnumConverter(namingPolicy, allowIntegerValues);
        }

        public override bool CanConvert(Type typeToConvert) => _baseConverter.CanConvert(typeToConvert);

        public override JsonConverter CreateConverter(Type typeToConvert, JsonSerializerOptions options)
        {
            var query = from field in typeToConvert.GetFields(BindingFlags.Public | BindingFlags.Static)
                        let attr = field.GetCustomAttribute<EnumMemberAttribute>()
                        where attr != null
                        select (field.Name, attr.Value);

            var dictionary = query.ToDictionary(p => p.Name, p => p.Value);
            return dictionary.Count > 0
                ? new JsonStringEnumConverter(new DictionaryLookupNamingPolicy(dictionary!, _namingPolicy), _allowIntegerValues)
                    .CreateConverter(typeToConvert, options)
                : _baseConverter.CreateConverter(typeToConvert, options);
        }
    }

    public class JsonNamingPolicyDecorator : JsonNamingPolicy
    {
        private readonly JsonNamingPolicy? _underlyingNamingPolicy;

        public JsonNamingPolicyDecorator(JsonNamingPolicy? underlyingNamingPolicy)
        {
            _underlyingNamingPolicy = underlyingNamingPolicy;
        }

        public override string ConvertName (string name) => _underlyingNamingPolicy?.ConvertName(name) ?? name;
    }

    internal class DictionaryLookupNamingPolicy : JsonNamingPolicyDecorator
    {
        private readonly Dictionary<string, string> _dictionary;

        public DictionaryLookupNamingPolicy(Dictionary<string, string> dictionary, JsonNamingPolicy? underlyingNamingPolicy)
            : base(underlyingNamingPolicy)
        {
            _dictionary = dictionary;
        }

        public override string ConvertName(string name) => _dictionary.TryGetValue(name, out var value) ? value : base.ConvertName(name);
    }
}
