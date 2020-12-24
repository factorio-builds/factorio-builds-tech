using System.ComponentModel.DataAnnotations;

#pragma warning disable 8618 // Non-nullable property must contain a non-null value when exiting constructor. Consider declaring the property as nullable.

namespace FactorioTech.Api.ViewModels
{
    public class UserModel
    {
        [Required]
        public string Username { get; set; }

        public string? DisplayName { get; set; }
    }
}
