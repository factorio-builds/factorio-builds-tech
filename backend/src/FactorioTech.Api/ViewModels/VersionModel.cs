using FactorioTech.Core.Domain;
using NodaTime;
using System.ComponentModel.DataAnnotations;

#pragma warning disable 8618 // Non-nullable property must contain a non-null value when exiting constructor. Consider declaring the property as nullable.

namespace FactorioTech.Api.ViewModels
{
    public class VersionLinks
    {
        /// <summary>
        /// The absolute URL to this version's full payload.
        /// </summary>
        [Required]
        public LinkModel Payload { get; init; }
    }

    public abstract class VersionModelBase : ViewModelBase<VersionLinks>
    {
        /// <summary>
        /// The version's payload hash.
        /// </summary>
        [Required]
        public Hash Hash { get; set; }

        /// <summary>
        /// The version's blueprint type.
        /// </summary>
        [Required]
        public BlueprintType Type { get; set; }

        /// <summary>
        /// The timestamp in UTC at which the version was created.
        /// </summary>
        [Required]
        [DataType(DataType.DateTime)]
        public Instant CreatedAt { get; set; }

        /// <summary>
        /// An optional name assigned to the version.
        /// </summary>
        public string? Name { get; set; }

        /// <summary>
        /// An optional description for the version.
        /// </summary>
        public string? Description { get; set; }
    }

    public class ThinVersionModel : VersionModelBase
    {
    }

    public class FullVersionModel : VersionModelBase
    {
        /// <summary>
        /// The payload attached to the version.
        /// </summary>
        [Required]
        public PayloadModelBase Payload { get; set; }
    }
}
