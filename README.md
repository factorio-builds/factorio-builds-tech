# factorio.tech

A [Factorio](https://www.factorio.com) blueprints hub. Currently in **public beta**: https://beta.factorio.tech

## Running locally

The entire factorio.tech stack can be run in a self-contained local environment using [docker-compose](https://docs.docker.com/compose/).

1. Set up and configure all prerequisites:

    1. Download [Factorio game data](#factorio-game-data)
    2. Configure at least one [external OAuth provider](#external-oauth-providers)

2. Build and run the application

        docker-compose up --detach --build --remove-orphans

3. Apply database migrations. You only need to run migrations the first time, but the command is safe to run repeatedly.

        docker build -t factorio-tech/build --target build .
        docker run --rm --network factorio-tech_default factorio-tech/build \
            ef database update --configuration Release --no-build \
                --project /app/src/FactorioTech.Core/FactorioTech.Core.csproj \
                --connection "Host=postgres;Database=postgres;Username=postgres;Password=postgres"

4. Open the website in your browser of choice and take it for a spin 🚀

    **Frontend**: http://localhost:4000

    **API**: http://localhost:4001/swagger/index.html

## Prerequisites

### Factorio game data

The Factorio game data is expected to be present in a Docker volume called `factorio`.
You can download this data either using Steam or from the official website: https://www.factorio.com/download
(note that the headless version does **not** work, as it doesn't include all necessary assets!).

    docker volume create factorio
    docker run -v factorio:/data --name helper busybox true

    cd ~/Factorio_1.0.0
    docker cp . helper:/data
    docker rm helper

### External OAuth providers

The factorio.tech application does not support logging in with username/password, but instead relies on external OAuth providers. To run the application locally, you need to configure at least one of the available providers from the table below. The callback URL must be set to `http://localhost:4000` (or match the host and port as specified in [docker-compose.yaml](docker-compose.yaml)) for running in Docker and `https://localhost:5001` for running in the IDE or `dotnet`.

| Key       | URL                                         |
| --------- | ------------------------------------------- |
| `GitHub`  | https://github.com/settings/developers      |
| `Discord` | https://discord.com/developers/applications |


Once you've created an OAuth app with your provider of choice, you have to configure the local environment to use the provider (replace `{key}` with the prover's key from the table above):

- For **Docker**: Create *two* configuration files that contain the `client_id` and the `client_secret` respectively: `secrets/OAuthProviders__{key}__ClientId.secret` and `secrets/OAuthProviders__{key}__ClientSecret.secret`
- For **IDE or dotnet**: Create `src/FactorioTech.Web/appsettings.secret.json` if it doesn't exist yet and **merge** the following settings, replacing the tokens in brackets `{}`:

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

## Contributing

factorio.tech is an [ASP.NET Core 5](https://docs.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-5.0) application. For local development you need the [.NET 5 SDK](https://dotnet.microsoft.com/download) installed on your machine along with a compatible IDE such as [Visual Studio Code](https://code.visualstudio.com), [Visual Studio Community](https://visualstudio.microsoft.com/vs/community) or [Rider](https://www.jetbrains.com/rider).

### Build and run

    dotnet run --project src/FactorioTech.Web/FactorioTech.Web.csproj

### Run tests

    dotnet test

This command will run **all tests**. To only run **fast** unit test, you can filter for tests with the matching type:

    dotnet test --filter Type=Fast

Conversely, you could opt to run only **slow** tests with db or other *slow* dependencies:

    dotnet test --filter Type=Slow

### Create a migration

     dotnet ef migrations add "xxx" -o Data/Migrations -p src/FactorioTech.Core/FactorioTech.Core.csproj

### Apply migrations

    dotnet ef database update -p src/FactorioTech.Core/FactorioTech.Core.csproj
