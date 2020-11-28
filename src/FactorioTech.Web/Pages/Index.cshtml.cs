using FactorioTech.Web.Core;
using FactorioTech.Web.Core.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Web.Pages
{
    public class IndexModel : PageModel
    {
        public const int PageSize = 100;

        public static string[] ValidOrderFields = { "title", "created", "updated" };
        public static string[] ValidOrderDirections = { "asc", "desc" };

        private readonly BlueprintService _blueprintService;

        public IndexModel(BlueprintService blueprintService)
        {
            _blueprintService = blueprintService;
        }

        public IEnumerable<Blueprint> Blueprints { get; private set; } = Enumerable.Empty<Blueprint>();
        public IEnumerable<SelectListItem> AvailableTags { get; private set; } = Enumerable.Empty<SelectListItem>();

        public IEnumerable<SelectListItem> SortFieldOptions { get; } = new List<SelectListItem>
        {
            new() { Value = "title", Text = "Title"},
            new() { Value = "created", Text = "Created" },
            new() { Value = "updated", Text = "Updated" },
        };

        public IEnumerable<SelectListItem> SortDirectionOptions { get; } = new List<SelectListItem>
        {
            new() { Value = "asc", Text = "Ascending"},
            new() { Value = "desc", Text = "Descending" },
        };

        public async Task<IActionResult> OnGetAsync(
            [FromQuery(Name = "page")]int currentPage = 1,
            [FromQuery(Name = "q")]string? queryStr = null,
            [FromQuery(Name = "tags")]string? tagsCsv = null,
            [FromQuery(Name = "sort")]string? sortCsv = null)
        {
            var sort = ParseSort(sortCsv);
            var tags = tagsCsv?.Split(',') ?? new string[0];

            Blueprints = await _blueprintService.GetBlueprints((currentPage, PageSize), sort, tags, queryStr);

            var (sortField, sortDirection) = ParseSort(sortCsv);
            SortFieldOptions.FirstOrDefault(x => x.Value == sortField)?.Let(item => item.Selected = true);
            SortDirectionOptions.FirstOrDefault(x => x.Value == sortDirection)?.Let(item => item.Selected = true);
            AvailableTags = Tags.All.Select(tag => new SelectListItem(tag, tag, tags.Contains(tag)));

            return Page();
        }

        public async Task<IActionResult> OnGetListAsync(
            [FromQuery(Name = "page")]int currentPage = 1,
            [FromQuery(Name = "q")]string? queryStr = null,
            [FromQuery(Name = "tags")]string? tagsCsv = null,
            [FromQuery(Name = "sort")]string? sortCsv = null)
        {
            Blueprints = await _blueprintService.GetBlueprints(
                (currentPage, PageSize),
                ParseSort(sortCsv),
                tagsCsv?.Split(',') ?? new string[0],
                queryStr);

            return Partial("_BlueprintListPartial", Blueprints);
        }

        private static (string Field, string Direction) ParseSort(string? csv)
        {
            var sort = csv?.ToLowerInvariant().Split(",");
            var field = sort?.ElementAtOrDefault(0);
            var direction = sort?.ElementAtOrDefault(1);

            if (field == null || !ValidOrderFields.Contains(field))
            {
                field = "updated";
            }

            if (direction == null || !ValidOrderDirections.Contains(direction))
            {
                direction = "desc";
            }

            return (field, direction);
        }
    }
}
