using FactorioTech.Web.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using OneOf;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Web.Pages.Blueprints
{
    public class ImportModel : PageModel
    {
        public class BindingModel
        {
            [Required]
            [DisplayName("Blueprint string")]
            [RegularExpression(
                // base64 starting with "0"
                "^0(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$",
                ErrorMessage = "This doesn't appear to be a valid blueprint string.")]
            public string Payload { get; set; } = string.Empty;
        }

        [BindProperty]
        public BindingModel Import { get; set; } = new();

        public OneOf<Blueprint, BlueprintBook>? ImportResult { get; set; }

        public void OnGet()
        {
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            ImportResult = await new BlueprintConverter().FromString(Import.Payload);

            return Page();
        }

        public IDictionary<string, int> GetEntityStats(Blueprint blueprint) =>
            blueprint.Entities
                .GroupBy(e => e.Name)
                .OrderByDescending(g => g.Count())
                .ToDictionary(g => g.Key.ToLowerInvariant(), g => g.Count());

        public string GetIconUrlForEntity(string key) =>
            $"https://wiki.factorio.com/images/{GetWikiKeyForEntity(key)}.png";

        public string GetWikiUrlForEntity(string key) => 
            $"https://wiki.factorio.com/{GetWikiKeyForEntity(key)}";

        private static string GetWikiKeyForEntity(string key) =>
            key switch
            {
                "small-lamp" => "Lamp",
                "logistic-chest-passive-provider" => "Passive_provider_chest",
                "logistic-chest-active-provider" => "Active_provider_chest",
                "logistic-chest-requester" => "Requester_chest",
                "logistic-chest-buffer" => "Buffer_chest",
                "logistic-chest-storage" => "Storage_chest",
                "stone-wall" => "Wall",
                { } k => k[..1].ToUpperInvariant() + k[1..].Replace("-", "_"),
            };
    }
}
