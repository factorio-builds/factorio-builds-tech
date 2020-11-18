using FactorioTech.Web.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using NodaTime;
using System;
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

        [TempData]
        public string? BlueprintString { get; set; }

        public ImportInputModel ImportInput { get; set; } = new();

        public CreateInputModel CreateInput { get; set; } = new();

        public FactorioApi.BlueprintBook? Book { get; set; }

        public List<(FactorioApi.Blueprint Blueprint, string Hash, string BlueprintImageUri)> Blueprints { get; set; } = new();

        public class ImportInputModel
        {
            [Required]
            [RegularExpression(
                // base64 starting with "0"
                "^0(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$",
                ErrorMessage = "This doesn't appear to be a valid blueprint string.")]
            public string BlueprintString { get; set; } = string.Empty;
        }

        public class CreateInputModel
        {
            [Required]
            [StringLength(100, MinimumLength = 3)]
            [RegularExpression("[a-z0-9_-]+")]
            public string Slug { get; set; } = string.Empty;

            [Required]
            [StringLength(100, MinimumLength = 3)]
            public string Title { get; set; } = string.Empty;

            public string? Description { get; set; }
        }

        public void OnGet()
        {
            ImportInput = new ImportInputModel
            {
                BlueprintString = BlueprintString ?? string.Empty
            };

            BlueprintString = null;
        }

        public async Task<IActionResult> OnPostAsync([FromForm]ImportInputModel importInput)
        {
            if (!ModelState.IsValid)
            {
                ImportInput = importInput;
                return Page();
            }

            var result = await _blueprintConverter.Decode(importInput.BlueprintString);
            await result.Match(HandleBlueprint, HandleBook);

            BlueprintString = importInput.BlueprintString;

            return Page();
        }

        public async Task<IActionResult> OnPostCreateAsync([FromForm]CreateInputModel createInput)
        {
            if (!ModelState.IsValid)
            {
                CreateInput = createInput;
                return Page();
            }

            var now = SystemClock.Instance.GetCurrentInstant();
            var blueprintId = Guid.NewGuid();

            //var version = new BlueprintVersion(
            //    Guid.NewGuid(),
            //    blueprintId,
            //    now,
            //    payload);

            //var blueprint = new Blueprint(
            //    blueprintId,
            //    User.GetUserId(),
            //    now,
            //    "slug",
            //    "title",
            //    "description",
            //    version);

            await Task.Delay(0);
            return RedirectToPage("./View");
        }

        private async Task HandleBlueprint(FactorioApi.Blueprint payload)
        {
            var encoded = await _blueprintConverter.Encode(payload);
            var (hash, imageUri) = await SaveBlueprintRendering(encoded);

            Blueprints.Add((payload, hash, imageUri));

            CreateInput = new CreateInputModel
            {
                Title = payload.Label ?? string.Empty,
                Slug = "slugified",
                Description = payload.Description,
            };
        }

        private async Task HandleBook(FactorioApi.BlueprintBook payload)
        {
            Book = payload;

            foreach (var blueprint in payload.Blueprints.OrderBy(x => x.Index).Select(x => x.Blueprint))
            {
                var encoded = await _blueprintConverter.Encode(blueprint);
                var (hash, imageUri) = await SaveBlueprintRendering(encoded);
                Blueprints.Add((blueprint, hash, imageUri));
            }

            CreateInput = new CreateInputModel
            {
                Title = payload.Label ?? string.Empty,
                Slug = "slugified",
            };
        }

        private async Task<(string Hash, string ImageUri)> SaveBlueprintRendering(string encoded)
        {
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
