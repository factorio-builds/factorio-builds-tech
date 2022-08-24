using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FactorioTech.Api.Extensions.Json;

/// <summary>
/// Workaround for System.Text.Json not supporting custom enum conversion (yet).
/// See https://github.com/dotnet/runtime/issues/31081
/// Code taken from https://stackoverflow.com/a/59061296
/// </summary>
public class CustomJsonStringEnumConverter : JsonConverterFactory
{
    private readonly JsonNamingPolicy? namingPolicy;
    private readonly bool allowIntegerValues;
    private readonly JsonStringEnumConverter baseConverter;

    public CustomJsonStringEnumConverter() : this(null, true) { }

    public CustomJsonStringEnumConverter(JsonNamingPolicy? namingPolicy = null, bool allowIntegerValues = true)
    {
        this.namingPolicy = namingPolicy;
        this.allowIntegerValues = allowIntegerValues;
        baseConverter = new JsonStringEnumConverter(namingPolicy, allowIntegerValues);
    }

    public override bool CanConvert(Type typeToConvert) => baseConverter.CanConvert(typeToConvert);

    public override JsonConverter CreateConverter(Type typeToConvert, JsonSerializerOptions options)
    {
        var query = from field in typeToConvert.GetFields(BindingFlags.Public | BindingFlags.Static)
            let attr = field.GetCustomAttribute<EnumMemberAttribute>()
            where attr != null
            select (field.Name, attr.Value);

        var dictionary = query.ToDictionary(p => p.Name, p => p.Value);
        return dictionary.Count > 0
            ? new JsonStringEnumConverter(new DictionaryLookupNamingPolicy(dictionary!, namingPolicy), allowIntegerValues)
                .CreateConverter(typeToConvert, options)
            : baseConverter.CreateConverter(typeToConvert, options);
    }
}

public class JsonNamingPolicyDecorator : JsonNamingPolicy
{
    private readonly JsonNamingPolicy? underlyingNamingPolicy;

    public JsonNamingPolicyDecorator(JsonNamingPolicy? underlyingNamingPolicy)
    {
        this.underlyingNamingPolicy = underlyingNamingPolicy;
    }

    public override string ConvertName (string name) => underlyingNamingPolicy?.ConvertName(name) ?? name;
}

internal class DictionaryLookupNamingPolicy : JsonNamingPolicyDecorator
{
    private readonly Dictionary<string, string> dictionary;

    public DictionaryLookupNamingPolicy(Dictionary<string, string> dictionary, JsonNamingPolicy? underlyingNamingPolicy)
        : base(underlyingNamingPolicy)
    {
        this.dictionary = dictionary;
    }

    public override string ConvertName(string name) => dictionary.TryGetValue(name, out var value) ? value : base.ConvertName(name);
}
