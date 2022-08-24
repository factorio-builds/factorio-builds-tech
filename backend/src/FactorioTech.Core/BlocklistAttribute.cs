using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Core;

public class BlocklistAttribute : ValidationAttribute
{
    private readonly HashSet<string> blocklist;

    public BlocklistAttribute(string blocklist)
    {
        this.blocklist = new HashSet<string>(blocklist.Split(","));
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        var str = value?.ToString()?.ToLowerInvariant();
        if (str != null && blocklist.Contains(str))
            return new ValidationResult($"{validationContext.DisplayName} must not match any of the blocked terms.");

        return ValidationResult.Success;
    }
}
