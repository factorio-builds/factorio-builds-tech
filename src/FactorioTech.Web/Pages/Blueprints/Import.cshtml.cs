using FactorioTech.Web.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Web.Pages.Blueprints
{
    public class ImportModel : PageModel
    {
        private readonly ImageService _imageService;
        private readonly BlueprintConverter _blueprintConverter;

        public ImportModel(ImageService imageService, BlueprintConverter blueprintConverter)
        {
            _imageService = imageService;
            _blueprintConverter = blueprintConverter;
        }

        [BindProperty]
        public InputModel Input { get; set; } = new();

        public FactorioApi.BlueprintBook? Book { get; private set; }
        public List<(FactorioApi.Blueprint Blueprint, string Hash, string BlueprintImageUri)> Blueprints { get; } = new();

        public class InputModel
        {
            [Required]
            [RegularExpression(
                // base64 starting with "0"
                "^0(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$",
                ErrorMessage = "This doesn't appear to be a valid blueprint string.")]
            public string Payload { get; set; } = string.Empty;
        }

        public void OnGet()
        {
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            var result = await _blueprintConverter.Decode(Input.Payload);
            await result.Match(
                async blueprint =>
                {
                    var (hash, imageUri) = await SaveBlueprintRendering(blueprint);
                    Blueprints.Add((blueprint, hash, imageUri));
                },
                async book =>
                {
                    foreach (var blueprint in book.Blueprints.OrderBy(x => x.Index).Select(x => x.Blueprint))
                    {
                        var (hash, imageUri) = await SaveBlueprintRendering(blueprint);
                        Blueprints.Add((blueprint, hash, imageUri));
                    }

                    Book = book;
                });

            return Page();
        }

        private async Task<(string Hash, string ImageUri)> SaveBlueprintRendering(FactorioApi.Blueprint blueprint)
        {
            var encoded = await _blueprintConverter.Encode(blueprint);
            var hash = await _imageService.SaveBlueprintRendering(encoded);
            return (hash, $"/api/files/blueprint/{hash}.jpg");
        }

        public IDictionary<string, int> GetEntityStats(FactorioApi.Blueprint blueprint) =>
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
