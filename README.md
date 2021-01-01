# factorio.tech

A [Factorio](https://www.factorio.com) blueprints hub. Currently in **public beta**: https://beta.factorio.tech

## Running locally

The entire factorio.tech stack can be run in a self-contained local environment using [docker-compose](https://docs.docker.com/compose).

1. Set up and configure prerequisites:

    1. **Required**: Download [Factorio game data](#factorio-game-data)
    2. *Optional*: Configure at least one [external OAuth provider](#optional-external-oauth-providers)
    3. *Optional*: Configure [trusted development certificates](#optional-trusted-development-certificates)

2. Run the application

    ```bash
    docker-compose up --detach --build --remove-orphans
    ```

    **Note**: This command will pull the [latest **ci** images](https://github.com/dstockhammer?tab=packages&repo_name=factorio-tech) from the GitHub Docker registry. If you prefer to instead **build** the images locally, open [docker-compose.yaml](docker-compose.yaml), comment out the lines with `image: ghcr.io/*` and uncomment the blocks with `image: factorio-tech/*` and `build: ..`. The same command will then build the Docker images locally.

3. Open the website in your browser of choice and take it for a spin 🚀

    - **Frontend**: https://local.factorio.tech
    - **API**: https://api.local.factorio.tech/swagger/index.html
    - **Identity Provider**: https://identity.local.factorio.tech/.well-known/openid-configuration

## Prerequisites

### Factorio game data

Due to licensing restrictions, we can not distribute the Factorio game assets with the source code. The game data has to be downloaded manually and made available to the application. See the [volume readme](.local/volumes/factorio) for more details and instructions.

### Optional: external OAuth providers

The factorio.tech application does not support logging in with username/password, but instead relies on external OAuth providers. To run the application locally, you need to configure at least one of the available providers from the table below. The callback URL must be set to `https://identity.local.factorio.tech` for running in Docker and `https://localhost:5001` for running in the IDE or `dotnet`.

| Key       | URL                                         |
| --------- | ------------------------------------------- |
| `GitHub`  | https://github.com/settings/developers      |
| `Discord` | https://discord.com/developers/applications |


Once you've created an OAuth app with your provider of choice, you have to configure the local environment to use the provider (replace `{key}` with the prover's key from the table above):

- For **Docker** (with `docker-compose`): Create *two* configuration files that contain the `client_id` and the `client_secret` respectively for each OAuth provider you wish to configure and put them into the `secrets` folder. See the [secrets readme](.local/secrets) for more details.

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

### Optional: trusted development certificates

The factorio.tech application **requires** TLS. Out of the box, self-signed (untrusted) certificates will be used, which requires bypassing certificate validation. If you prefer, you can *optionally* create trusted development certificates using a tool like [mkcert](https://github.com/FiloSottile/mkcert). Installation and setup depends on your local environment, so please follow the instructions on the website to get it up and running. Once configured, run the following command **from the repository root** to create the required certificates:

```bash
mkcert -cert-file .local/traefik/certs/local-cert.pem -key-file .local/traefik/certs/local-key.pem \
  "local.factorio.tech" "*.local.factorio.tech"
```

Traefik is configured to automatically pick up those certificates and use them instead of the self-signed one. You may need to restart traefik to apply the changes:

```bash
docker restart factorio-tech_traefik_1
```

## Contributing

factorio.tech is an [ASP.NET Core 5](https://docs.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-5.0) application. For local development you need the [.NET 5 SDK](https://dotnet.microsoft.com/download) installed on your machine along with a compatible IDE such as [Visual Studio Code](https://code.visualstudio.com), [Visual Studio Community](https://visualstudio.microsoft.com/vs/community) or [Rider](https://www.jetbrains.com/rider).

### Build and run

```bash
dotnet run --project src/FactorioTech.Web/FactorioTech.Web.csproj
```

### Run tests

```bash
dotnet test
```

This command will run **all tests**. To only run **fast** unit test, you can filter for tests with the matching type:

```bash
dotnet test --filter Type=Fast
```

Conversely, you could opt to run only **slow** tests with db or other *slow* dependencies:

```bash
dotnet test --filter Type=Slow
```

### Create a migration

```bash
dotnet ef migrations add "xxx" -o Data/Migrations -p src/FactorioTech.Core/FactorioTech.Core.csproj
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
        --project /app/src/FactorioTech.Core/FactorioTech.Core.csproj \
        --connection "Host=postgres;Database=postgres;Username=postgres;Password=postgres"
```
