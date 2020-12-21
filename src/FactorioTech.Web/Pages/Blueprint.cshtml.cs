using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Web.Extensions;
using FactorioTech.Web.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Web.Pages
{
    public class BlueprintModel : PageModel
    {
        private readonly AppDbContext _dbContext;
        private readonly SignInManager<User> _signInManager;
        private readonly BlueprintConverter _converter;

        public BlueprintModel(
            AppDbContext dbContext,
            SignInManager<User> signInManager,
            BlueprintConverter converter)
        {
            _dbContext = dbContext;
            _signInManager = signInManager;
            _converter = converter;
        }

        [TempData]
        public string? StatusMessage { get; set; }

        public Blueprint Blueprint { get; private set; } = null!;
        public BlueprintVersion SelectedVersion { get; private set; } = null!;
        public IList<BlueprintVersion> Versions { get; private set; } = null!;
        public FactorioApi.BlueprintEnvelope Envelope { get; private set; } = null!;
        public PayloadCache PayloadCache { get; } = new();
        public ImportInputModel ImportInput { get; private set; } = new();

        public async Task<IActionResult> OnGetAsync(string user, string slug, string? hash)
        {
            var query = _dbContext.Blueprints
                .Where(bp => bp.NormalizedSlug == slug.ToUpperInvariant()
                             && bp.NormalizedOwnerSlug == user.ToUpperInvariant());

            if (hash == null)
            {
                query = query.Include(bp => bp.LatestVersion!).ThenInclude(v => v.Payload);
            }

            Blueprint = await query
                .Include(bp => bp.Owner)
                .FirstOrDefaultAsync();

            if (Blueprint == null)
                return NotFound();

            // don't include in the initial query as this will cause a massive cross join
            await _dbContext.Entry(Blueprint).Collection(e => e.Tags).LoadAsync();

            Versions = await _dbContext.BlueprintVersions.AsNoTracking()
                .Where(v => v.BlueprintId == Blueprint.BlueprintId)
                .OrderByDescending(v => v.CreatedAt)
                .ToListAsync();

            if (hash == null)
            {
                SelectedVersion = Blueprint.LatestVersion!;
            }
            else
            {
                SelectedVersion = await _dbContext.BlueprintVersions.AsNoTracking()
                    .Where(v => v.BlueprintId == Blueprint.BlueprintId && v.Hash == new Hash(hash))
                    .Include(v => v.Payload)
                    .FirstOrDefaultAsync();

                if (SelectedVersion == null)
                {
                    StatusMessage = $"The version <strong>{hash}</strong> could not be found in this blueprint. Displaying the latest version.";
                    return RedirectToPage(new { user, slug, hash = (string?)null });
                }
            }

            if (SelectedVersion.Payload != null)
            {
                Envelope = await _converter.Decode(SelectedVersion.Payload.Encoded);
                PayloadCache.TryAdd(Envelope, SelectedVersion.Payload);
                await PayloadCache.EnsureInitializedGraph(Envelope);
            }

            ImportInput.ParentSlug = Blueprint.Slug;

            ViewData["Title"] = $"{Blueprint.OwnerSlug}/{Blueprint.Slug}: {Blueprint.Title}";

            return Page();
        }

        public async Task<IActionResult> OnPostFavoriteAsync(Guid blueprintId)
        {
            if (!_signInManager.IsSignedIn(User))
                return Unauthorized();

            var favorite = await _dbContext.Favorites.AsNoTracking()
                .FirstOrDefaultAsync(x => x.BlueprintId == blueprintId && x.UserId == User.GetUserId());

            if (favorite != null)
            {
                _dbContext.Remove(favorite);
            }
            else
            {
                _dbContext.Add(new Favorite
                {
                    BlueprintId = blueprintId,
                    UserId = User.GetUserId(),
                });
            }

            await _dbContext.SaveChangesAsync();

            var count = await _dbContext.Favorites.CountAsync(x => x.BlueprintId == blueprintId);

            return Partial("_PlainText", count);
        }
    }
}
