using NodaTime;
using System;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Web.Core.Domain
{
    public class Favorite
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid BlueprintId { get; set; }

        [Required]
        public Instant CreatedAt { get; set; }

        // navigation properties -> will be null if not included explicitly

        public User? User { get; set; }
        public Blueprint? Blueprint { get; set; }
    }
}
