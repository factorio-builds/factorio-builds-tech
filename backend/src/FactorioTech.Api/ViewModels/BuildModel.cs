using FactorioTech.Core;
using FactorioTech.Core.Domain;
using NodaTime;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#pragma warning disable 8618 // Non-nullable property must contain a non-null value when exiting constructor. Consider declaring the property as nullable.

namespace FactorioTech.Api.ViewModels
{
    public abstract class BuildLinksBase
    {
        /// <summary>
        /// The absolute URL of this build's full details.
        /// </summary>
        [Required]
        public LinkModel Self { get; init; }

        /// <summary>
        /// The absolute URL of this build's cover image.
        /// </summary>
        [Required]
        public ImageLinkModel Cover { get; init; }

        /// <summary>
        /// The absolute URL of the list of this build's versions.
        /// </summary>
        [Required]
        public LinkModel Versions { get; init; }

        /// <summary>
        /// The absolute URL of the list of this build's followers.
        /// </summary>
        [Required]
        public CollectionLinkModel Followers { get; init; }

        /// <summary>
        /// The absolute URL of the API endpoint to add a version to this build.
        /// Only available if the call has been made with an authenticated user token
        /// and the authenticated user is the owner of the build.
        /// </summary>
        public LinkModel? AddVersion { get; init; }

        /// <summary>
        /// The absolute URL of the API endpoint to edit this build.
        /// Only available if the call has been made with an authenticated user token
        /// and the authenticated user has the required permissions.
        /// </summary>
        public LinkModel? Edit { get; init; }

        /// <summary>
        /// The absolute URL of the API endpoint to delete this build.
        /// Only available if the call has been made with an authenticated user token
        /// and the authenticated user has the required permissions.
        /// </summary>
        public LinkModel? Delete { get; init; }
    }

    public class FullBuildLinks : BuildLinksBase
    {
        /// <summary>
        /// The absolute URL of the API endpoint to **add** this build to the authenticated user's favorites.
        /// Only available if the call has been made with an authenticated user token
        /// and the user currently **does not** follow this build.
        /// </summary>
        public LinkModel? AddFavorite { get; init; }

        /// <summary>
        /// The absolute URL of the API endpoint to **remove** this build to the authenticated user's favorites.
        /// Only available if the call has been made with an authenticated user token
        /// and the user currently **does** follow this build.
        /// </summary>
        public LinkModel? RemoveFavorite { get; init; }
    }

    public class ThinBuildLinks : BuildLinksBase
    {

    }

    public abstract class BuildModelBase<TUser, TLinks> : ViewModelBase<TLinks>
        where TUser : ThinUserModel
        where TLinks : BuildLinksBase, new()
    {
        /// <summary>
        /// The slug is used in the build's URL and must be unique per user.
        /// It can consist only of latin alphanumeric characters, underscores and hyphens.
        /// </summary>
        /// <example>my-awesome-build</example>
        [Required]
        [StringLength(AppConfig.Policies.Slug.MaximumLength, MinimumLength = AppConfig.Policies.Slug.MinimumLength)]
        [RegularExpression(AppConfig.Policies.Slug.AllowedCharactersRegex)]
        public string Slug { get; set; }

        /// <summary>
        /// The timestamp in UTC of when the first version of the build was created.
        /// </summary>
        [Required]
        [DataType(DataType.DateTime)]
        public Instant CreatedAt { get; set; }

        /// <summary>
        /// The timestamp in UTC of when the build was last updated.
        /// </summary>
        [Required]
        [DataType(DataType.DateTime)]
        public Instant UpdatedAt { get; set; }

        /// <summary>
        /// The build's icons.
        /// </summary>
        [Required]
        public IEnumerable<GameIcon> Icons { get; set; }

        /// <summary>
        /// The title or display name of the build.
        /// </summary>
        /// <example>My Awesome Build</example>
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; }

        /// <summary>
        /// The build's description in Markdown.
        /// </summary>
        [DataType(DataType.MultilineText)]
        public string? Description { get; set; }

        /// <summary>
        /// The user who created the build.
        /// </summary>
        [Required]
        public TUser Owner { get; set; }

        /// <summary>
        /// The game version that was used to create the the most recently added version of this build.
        /// </summary>
        /// <example>1.2.3.4</example>
        [Required]
        public Version LatestGameVersion { get; set; }

        /// <summary>
        /// The build's latest version's blueprint type.
        /// </summary>
        [Required]
        public BlueprintType LatestType { get; set; }

        /// <summary>
        /// The build's tags.
        /// </summary>
        [Required]
        public IEnumerable<string> Tags { get; set; }
    }

    public class ThinBuildModel : BuildModelBase<ThinUserModel, ThinBuildLinks>
    {
    }

    public class FullBuildModel : BuildModelBase<FullUserModel, FullBuildLinks>
    {
        /// <summary>
        /// The build's most recently added version.
        /// </summary>
        [Required]
        public FullVersionModel LatestVersion { get; set; }
    }
}
