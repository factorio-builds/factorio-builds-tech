using Microsoft.AspNetCore.Identity;
using NodaTime;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Core.Domain
{
    public class User : IdentityUser<Guid>
    {
        [Required]
        public Instant RegisteredAt { get; init; }

        public DateTimeZone? TimeZone { get; set; }

        [MinLength(3)]
        [MaxLength(256)]
        [ProtectedPersonalData]
        public string? DisplayName { get; set; }

        // navigation properties -> will be null if not included explicitly

        public IEnumerable<Build>? Builds { get; set; }

        public IEnumerable<Build>? Favorites { get; set; }
    }
}
