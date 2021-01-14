using FactorioTech.Core.Domain;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

#pragma warning disable 8618 // Non-nullable property must contain a non-null value when exiting constructor. Consider declaring the property as nullable.

namespace FactorioTech.Api.ViewModels
{
    public class PayloadLinks
    {
        /// <summary>
        /// The absolute URL of this payload's full details.
        /// </summary>
        [Required]
        public LinkModel Self { get; init; }

        /// <summary>
        /// The absolute URL of this payload's raw encoded blueprint string for import in the game or other tools.
        /// </summary>
        [Required]
        public LinkModel Raw { get; init; }

        /// <summary>
        /// The absolute URL of this payload's full-size rendering.
        /// Only available if the payload is of type `blueprint`.
        /// </summary>
        public LinkModel? RenderingFull { get; init; }

        /// <summary>
        /// The absolute URL of this payload's rendering thumbnail.
        /// Only available if the payload is of type `blueprint`.
        /// </summary>
        public LinkModel? RenderingThumb { get; init; }
    }

    [SwaggerDiscriminator("type")]
    [SwaggerSubType(typeof(BlueprintPayloadModel), DiscriminatorValue = "blueprint")]
    [SwaggerSubType(typeof(BookPayloadModel), DiscriminatorValue = "blueprint-book")]
    public abstract class PayloadModelBase : ViewModelBase<PayloadLinks>
    {
        /// <summary>
        /// The `md5` hash of the payload's encoded blueprint string.
        /// </summary>
        /// <example>f8283ab0085a7e31c0ad3c43db36ae87</example>
        [Required]
        public Hash Hash { get; set; }

        /// <summary>
        /// The payload's blueprint type.
        /// </summary>
        [Required]
        public BlueprintType Type { get; set; }

        /// <summary>
        /// The game version that was used to create the blueprint.
        /// </summary>
        /// <example>1.2.3.4</example>
        [Required]
        public Version GameVersion { get; set; }

        /// <summary>
        /// The raw encoded blueprint string for import in the game or other tools
        /// </summary>
        /// <example>0eNqllMtugzAQRX8FzRqiQszLyyy77bKqKh6jaiTbWLapghD/XhOkNEpJ04adx56553r8GKEWPWpDygEfoUXbGNKOOgUcnnvrgiqwJLXA4Jy4gxCo6ZQF/jqCpQ9VibnYDRp9FTmUPkNVco7wqA1aGzlTKas746IahYPJS6gWj8DjKbwrYjW1aJzxrr4Lk+ktBFSOHOFi5RQM76qXNRqvfM9ECLqztGx2hNlLud+lIQzAi3nkWS0ZbJaMZDZ6hUgeQCT/Q+wfQLDbCLaCYGeExJZ6GaHw6YaaSHcCf2+TR00rkummxqTrotmmA02vW5GtIPJNvm80o9h0hH/yXW5CsJ+3xL+t0xvkFx9ECKLyYn7uZfkSDhdLn2jscomLmOWszLM8fsrSbJq+AEDWdWo=</example>
        [Required]
        public string Encoded { get; set; }

        /// <summary>
        /// The ordered list of 1 to 4 icons that is included in the ingame blueprint payload.
        /// </summary>
        [Required]
        public IEnumerable<GameIcon> Icons { get; set; } = Enumerable.Empty<GameIcon>();

        /// <summary>
        /// An optional label that is included in the ingame blueprint payload.
        /// </summary>
        public string? Label { get; set; }

        /// <summary>
        /// An optional description that is included in the ingame blueprint payload.
        /// </summary>
        public string? Description { get; set; }
    }

    public class BlueprintPayloadModel : PayloadModelBase
    {
        /// <summary>
        /// A map of item `name` to `count` of all **entities** in this payload's blueprint.
        /// Only items with a count greater than 0 are included.
        /// </summary>
        [Required]
        public IReadOnlyDictionary<string, int> Entities { get; set; } = new Dictionary<string, int>();

        /// <summary>
        /// A map of item `name` to `count` of all **tiles** in this payload's blueprint.
        /// Only items with a count greater than 0 are included.
        /// </summary>
        [Required]
        public IReadOnlyDictionary<string, int> Tiles { get; set; } = new Dictionary<string, int>();
    }

    public class BookPayloadModel : PayloadModelBase
    {
        /// <summary>
        /// All payloads that are included in this blueprint book.
        /// Only set when the `include_children` query parameter is `true`.
        /// </summary>
        [Required]
        public IEnumerable<PayloadModelBase>? Children { get; set; }
    }
}
