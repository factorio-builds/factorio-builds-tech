using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace FactorioTech.Api.ViewModels
{
    public class UsersModel
    {
        [Required]
        public int Count { get; set; }

        [Required]
        public IEnumerable<UserModel> Users { get; set; } = Enumerable.Empty<UserModel>();
    }
}
