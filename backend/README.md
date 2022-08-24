# Factorio Builds Backend

factorio.tech is an [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core)
application. For local development you need the [.NET SDK](https://dotnet.microsoft.com/download)
installed on your machine along with a compatible IDE such as [Visual Studio Code](https://code.visualstudio.com),
[Visual Studio](https://visualstudio.microsoft.com/vs) or [Rider](https://www.jetbrains.com/rider).

## Components

-   REST (mostly) API: [FactorioTech.Api](src/FactorioTech.Api) powered by [ASP.NET Core MVC Controllers](https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/actions)
-   Identity Provider: [FactorioTech.Identity](src/FactorioTech.Identity) powered by [IdentityServer](https://duendesoftware.com/products/identityserver)
-   Database: [PostgreSQL](https://www.postgresql.org) via [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core) with [Npgsql](https://www.npgsql.org/efcore/index.html)

## Contributing

### Run tests

```bash
dotnet test
```

This command will run **all tests**. To only run **fast** unit test, you can filter for tests with the matching type:

```bash
dotnet test --filter Type=Fast
```

Conversely, you could opt to run only **slow** tests with db or other _slow_ dependencies:

```bash
dotnet test --filter Type=Slow
```

### Create a migration

```bash
dotnet ef migrations add "xxx" -o Data/Migrations -c AppDbContext -p src/FactorioTech.Core/FactorioTech.Core.csproj
```

### Apply migrations

```bash
dotnet ef database update -p src/FactorioTech.Core/FactorioTech.Core.csproj
```

or using Docker

```bash
docker build -t factorio-tech/build --target build .
docker run --rm --network factorio-tech_default factorio-tech/build \
    ef database update --configuration Release --no-build \
        --context AppDbContext \
        --project /app/src/FactorioTech.Core/FactorioTech.Core.csproj \
        --connection "Host=postgres;Database=postgres;Username=postgres;Password=postgres"
```

### Configure OAuth providers

You can configure OAuth providers for local development the same way as for Docker, except for two differences:

-   The callback uri must be set to `https://localhost:5001`
-   The configuration source used by `dotnet` is different. Create `backend/src/FactorioTech.Identity/appsettings.secret.json` if it doesn't exist yet and **merge** the following settings, replacing the tokens in brackets `{}`:

    ```json
    {
        "OAuthProviders": {
            "{key}": {
                "ClientId": "{client_id}",
                "ClientSecret": "{client_secret}"
            }
        }
    }
    ```
