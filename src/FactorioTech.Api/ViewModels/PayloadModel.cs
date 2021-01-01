using FactorioTech.Core.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#pragma warning disable 8618 // Non-nullable property must contain a non-null value when exiting constructor. Consider declaring the property as nullable.

namespace FactorioTech.Api.ViewModels
{
    public abstract class PayloadModelBase : ViewModelBase
    {
        /// <summary>
        /// The `md5` hash of the payload's blueprint `encoded` string.
        /// </summary>
        /// <example>deab61eafb24af64f133cce738dfbabd</example>
        [Required]
        public Hash Hash { get; set; }

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

        [Required]
        public BlueprintEnvelopeModel Blueprint { get; set; }
    }

    public class ThinPayloadModel : PayloadModelBase
    {

    }

    public class FullPayloadModel : PayloadModelBase
    {
        /// <summary>
        /// If the payload is a `blueprint-book`, children contains all nested blueprints.
        /// For payloads of type `blueprint`, this collection is empty.
        /// </summary>
        public IEnumerable<FullPayloadModel> Children { get; set; }
    }
}
