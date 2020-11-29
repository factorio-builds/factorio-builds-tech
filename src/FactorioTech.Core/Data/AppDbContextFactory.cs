using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FactorioTech.Core.Data
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseNpgsql(
                "Host=localhost;Database=postgres;Username=postgres;Password=postgres",
                o => o.UseNodaTime());

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
