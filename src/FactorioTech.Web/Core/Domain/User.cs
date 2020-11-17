using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Web.Core.Domain
{
    public class User : IdentityUser<Guid>
    {
        [MinLength(3)]
        [MaxLength(255)]
        [ProtectedPersonalData]
        public virtual string? DisplayName { get; set; }
    }
}
