using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Options;

namespace FactorioTech.Core.Data;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args) =>
        CreateDbContext("Host=localhost;Database=postgres;Username=postgres;Password=postgres");

    public static AppDbContext CreateDbContext(string connectionString)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(connectionString, o => o.UseNodaTime());
        return new AppDbContext(optionsBuilder.Options, Options.Create(new OperationalStoreOptions()));
    }
}