using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Web.Core.Domain
{
    public class User : IdentityUser<Guid>
    {
        //[Required]
        //public Instant RegisteredAt { get; init; }

        //[Required]
        //public string TimeZone { get; set; } = "Europe/Berlin";

        [MinLength(3)]
        [MaxLength(256)]
        [ProtectedPersonalData]
        public string? DisplayName { get; set; }

        // navigation properties -> will be null if not included explicitly

        public IEnumerable<Blueprint>? Blueprints { get; set; }
    }
}
