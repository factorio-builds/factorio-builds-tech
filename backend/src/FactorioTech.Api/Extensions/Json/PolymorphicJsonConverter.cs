using System.Text.Json;
using System.Text.Json.Serialization;

namespace FactorioTech.Api.Extensions.Json;

/// <summary>
/// Workaround for System.Text.Json not supporting polymorphic serialization (yet?).
/// See https://docs.microsoft.com/en-us/dotnet/standard/serialization/system-text-json-polymorphism
/// </summary>
public sealed class PolymorphicJsonConverter<T> : JsonConverter<T> where T : class
{
    public override bool HandleNull => false;
    public override bool CanConvert(Type typeToConvert) => typeof(T).IsAssignableFrom(typeToConvert);

    public override T? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var newOptions = new JsonSerializerOptions(options);
        for (var i = newOptions.Converters.Count - 1; i >= 0; i--)
        {
            if (newOptions.Converters[i].GetType() == GetType())
            {
                newOptions.Converters.RemoveAt(i);
            }
        }
        return JsonSerializer.Deserialize(ref reader, typeToConvert, newOptions) as T;
    }

    public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
    {
        writer.WriteStartObject();

        foreach (var property in value.GetType().GetProperties())
        {
            if (!property.CanRead)
                continue;

            var propertyValue = property.GetValue(value);
            if (propertyValue == null)
                continue;

            var propertyName = property.CustomAttributes.FirstOrDefault(a => a.AttributeType == typeof(JsonPropertyNameAttribute))
                                   ?.ConstructorArguments.FirstOrDefault().Value as string
                               ?? options.PropertyNamingPolicy?.ConvertName(property.Name)
                               ?? property.Name;

            writer.WritePropertyName(propertyName);
            JsonSerializer.Serialize(writer, propertyValue, options);
        }

        writer.WriteEndObject();
    }
}
