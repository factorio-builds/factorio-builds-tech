using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Core
{
    public class BlocklistAttribute : ValidationAttribute
    {
        private readonly HashSet<string> _blocklist;

        public BlocklistAttribute(string blocklist)
        {
            _blocklist = new HashSet<string>(blocklist.Split(","));
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var str = value?.ToString()?.ToLowerInvariant();
            if (str != null && _blocklist.Contains(str))
                return new ValidationResult($"{validationContext.DisplayName} must not match any of the blocked terms.");

            return ValidationResult.Success;
        }
    }
}
