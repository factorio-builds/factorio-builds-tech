using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace FactorioTech.Api.ViewModels
{
    public class BuildsQueryParams
    {
        public const int PageSize = 100;

        /// <summary>
        /// The desired page
        /// </summary>
        [FromQuery(Name = "page")]
        public int Page { get; set; } = 1;

        /// <summary>
        /// The desired field to sort the results
        /// </summary>
        [FromQuery(Name = "sort_field")]
        public BuildService.SortField SortField { get; set; } = BuildService.SortField.Updated;

        /// <summary>
        /// The desired direction to sort the results
        /// </summary>
        [FromQuery(Name = "sort_direction")]
        public BuildService.SortDirection SortDirection { get; set; } = BuildService.SortDirection.Desc;

        /// <summary>
        /// An optional search term to filter the results by
        /// </summary>
        [FromQuery(Name = "q")]
        public string? Search { get; set; }

        /// <summary>
        /// An optional list of tags to filter the results by
        /// </summary>
        [FromQuery(Name = "tags")]
        public string[]? Tags { get; set; }

        /// <summary>
        /// An optional game version to filter the results by
        /// </summary>
        [FromQuery(Name = "version")]
        public string? Version { get; set; }

        public object ToValues(int? page) => new
        {
            page = page ?? Page,
            sort_field = SortField.ToString().ToLowerInvariant(),
            sort_direction = SortDirection.ToString().ToLowerInvariant(),
            q = Search,
            tags = Tags,
            version = Version,
        };
    }
}
