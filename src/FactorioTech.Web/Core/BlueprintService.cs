using FactorioTech.Web.Core.Domain;
using FactorioTech.Web.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Web.Core
{
    public class BlueprintService
    {
        private readonly AppDbContext _ctx;

        public BlueprintService(AppDbContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<Blueprint>> GetBlueprints(
            (int Current, int Size) page,
            (string Field, string Direction) sort,
            IReadOnlyCollection<string> tags,
            string? search)
        {
            var query = !tags.Any()
                ? _ctx.Blueprints.AsNoTracking()
                : _ctx.Tags.AsNoTracking()
                    .Where(t => tags.Contains(t.Value))
                    .Join(_ctx.Blueprints.AsNoTracking(),
                        t => t.BlueprintId,
                        bp => bp.BlueprintId,
                        (t, bp) => bp)
                    .Distinct();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(x => x.SearchVector!.Matches(EF.Functions.WebSearchToTsQuery("english", search)));
            }

            query = sort switch
            {
                ("title", "asc") => query.OrderBy(x => x.Title),
                ("title", "desc") => query.OrderByDescending(x => x.Title),
                ("created", "asc") => query.OrderBy(x => x.CreatedAt),
                ("created", "desc") => query.OrderByDescending(x => x.CreatedAt),
                ("updated", "asc") => query.OrderBy(x => x.UpdatedAt),
                ("updated", "desc") => query.OrderByDescending(x => x.UpdatedAt),
                _ => throw new ArgumentOutOfRangeException(nameof(sort)),
            };

            return await query
                .Skip(Math.Max(page.Current - 1, 0) * page.Size).Take(page.Size)
                .ToListAsync();
        }
    }
}
