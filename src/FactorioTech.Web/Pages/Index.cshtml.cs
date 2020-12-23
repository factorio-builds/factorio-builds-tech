using FactorioTech.Core;
using FactorioTech.Core.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Web.Pages
{
    public class IndexModel : PageModel
    {
        private const int PageSize = 100;

        private readonly BlueprintService _blueprintService;

        public IndexModel(BlueprintService blueprintService)
        {
            _blueprintService = blueprintService;
        }

        public IEnumerable<Blueprint> Blueprints { get; private set; } = Enumerable.Empty<Blueprint>();
        public IEnumerable<SelectListItem> TagsSelectItems { get; private set; } = Enumerable.Empty<SelectListItem>();

        public IEnumerable<SelectListItem> SortFieldOptions { get; } =
            Enum.GetNames<BlueprintService.SortField>()
                .Select(x => new SelectListItem(x.ToString(), x.ToLowerInvariant()));

        public IEnumerable<SelectListItem> SortDirectionOptions { get; } =
            Enum.GetNames<BlueprintService.SortDirection>()
                .Select(x => new SelectListItem(x.ToString(), x.ToLowerInvariant()));

        public async Task<IActionResult> OnGetAsync(
            [FromQuery(Name = "page")] int currentPage = 1,
            [FromQuery(Name = "q")] string? queryStr = null,
            [FromQuery(Name = "tags")] string? tagsCsv = null,
            [FromQuery(Name = "sort")] string? sortCsv = null,
            [FromQuery(Name = "version")] string? version = null)
        {
            var sort = ParseSort(sortCsv);
            var tags = tagsCsv?.Split(',') ?? Array.Empty<string>();

            Blueprints = await _blueprintService.GetBlueprints((currentPage, PageSize), sort, tags, queryStr, version);

            var (sortField, sortDirection) = ParseSort(sortCsv);
            SortFieldOptions.FirstOrDefault(x => x.Value == sortField.ToString().ToLowerInvariant())?.Let(item => item.Selected = true);
            SortDirectionOptions.FirstOrDefault(x => x.Value == sortDirection.ToString().ToLowerInvariant())?.Let(item => item.Selected = true);
            TagsSelectItems = Tags.All.Select(tag => new SelectListItem(tag, tag, tags.Contains(tag)));

            return Page();
        }

        public async Task<IActionResult> OnGetListAsync(
            [FromQuery(Name = "page")] int currentPage = 1,
            [FromQuery(Name = "q")] string? queryStr = null,
            [FromQuery(Name = "tags")] string? tagsCsv = null,
            [FromQuery(Name = "sort")] string? sortCsv = null,
            [FromQuery(Name = "version")] string? version = null)
        {
            Blueprints = await _blueprintService.GetBlueprints(
                (currentPage, PageSize),
                ParseSort(sortCsv),
                tagsCsv?.Split(',') ?? Array.Empty<string>(),
                queryStr, version);

            return Partial("_BlueprintList", Blueprints);
        }

        private static (BlueprintService.SortField Field, BlueprintService.SortDirection Direction) ParseSort(string? csv)
        {
            var sort = csv?.ToLowerInvariant().Split(",");

            if (!Enum.TryParse(sort?.ElementAtOrDefault(0), true, out BlueprintService.SortField field))
            {
                field = BlueprintService.SortField.Updated;
            }

            if (!Enum.TryParse(sort?.ElementAtOrDefault(1), true, out BlueprintService.SortDirection direction))
            {
                direction = BlueprintService.SortDirection.Desc;
            }

            return (field, direction);
        }
    }
}
