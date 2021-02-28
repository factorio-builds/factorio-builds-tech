using NodaTime;
using System;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Core.Domain
{
    public class Favorite
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid BuildId { get; set; }

        [Required]
        public Instant CreatedAt { get; set; }

        // navigation properties -> will be null if not included explicitly

        public User? User { get; set; }
        public Build? Build { get; set; }
    }
}
