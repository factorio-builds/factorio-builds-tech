using FactorioTech.Core.Domain;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Api.Extensions;

public class ValidateTagAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is IEnumerable<string> tags)
        {
            var buildTags = validationContext.GetRequiredService<BuildTags>();
            var invalidTags = tags.Except(buildTags).ToArray();
            if (invalidTags.Any())
            {
                return new ValidationResult($"The following tags are invalid: {string.Join(',', invalidTags)}");
            }
        }

        return ValidationResult.Success;
    }
}