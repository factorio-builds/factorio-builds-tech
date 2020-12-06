using Microsoft.EntityFrameworkCore;

namespace FactorioTech.Tests.Helpers
{
    public static class TestUtils
    {
        public static DbContext ClearCache(this DbContext db)
        {
            foreach (var entry in db.ChangeTracker.Entries())
            {
                db.Entry(entry.Entity).State = EntityState.Detached;
            }

            return db;
        }

    }
}
