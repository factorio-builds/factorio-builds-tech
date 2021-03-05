# Factorio Builds/Tech

This project aims to be a website and tool to share and browse [blueprints](https://wiki.factorio.com/Blueprint) for the [Factorio](https://factorio.com/) game, with strong values in user experience to make it the least painful experience to search/filter, and create builds.

## Quick links

- [Figma](https://www.figma.com/file/eDiTI6ZiAHHgoGSgXaWBO0/factorio-builds?node-id=393%3A11)
- [Issues](https://github.com/factorio-builds/factorio-builds-tech/issues)
- [Pull requests](https://github.com/factorio-builds/factorio-builds-tech/pulls)
- [Roadmap](https://github.com/factorio-builds/factorio-builds-tech/milestones?direction=asc&sort=title&state=open)

## Running locally

The entire stack can be run in a self-contained local environment using [docker-compose](https://docs.docker.com/compose).

1. Set up and configure prerequisites:

   1. **Required**: Download [Factorio game data](#factorio-game-data)
   2. _Optional_: Configure at least one [external OAuth provider](#optional-external-oauth-providers)
   3. _Optional_: Configure [trusted development certificates](#optional-trusted-development-certificates)

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

The factorio.tech application does not support logging in with username/password, but instead relies on external OAuth providers. To run the application locally, you need to configure at least one of the available providers from the table below. The callback URL must be set to `https://identity.local.factorio.tech`.

| Key       | URL                                         |
| --------- | ------------------------------------------- |
| `GitHub`  | https://github.com/settings/developers      |
| `Discord` | https://discord.com/developers/applications |

Once you've created an OAuth app with your provider of choice, you have to configure the local environment to use the provider: Create _two_ configuration files that contain the `client_id` and the `client_secret` respectively for each OAuth provider you wish to configure and put them into the `secrets` folder. See the [secrets readme](.local/secrets) for more details.

### Optional: trusted development certificates

The factorio.tech application **requires** TLS. Out of the box, self-signed (untrusted) certificates will be used, which requires bypassing certificate validation. If you prefer, you can _optionally_ create trusted development certificates using a tool like [mkcert](https://github.com/FiloSottile/mkcert). Installation and setup depends on your local environment, so please follow the instructions on the website to get it up and running. Once configured, run the following command **from the repository root** to create the required certificates:

```bash
mkcert -cert-file .local/traefik/certs/local-cert.pem -key-file .local/traefik/certs/local-key.pem \
  "local.factorio.tech" "*.local.factorio.tech"
```

Traefik is configured to automatically pick up those certificates and use them instead of the self-signed one. You may need to restart traefik to apply the changes:

```bash
docker restart factorio-tech_traefik_1
```

## Contributing

This is a monorepo that contains components in different tech stacks that make up factorio builds:

- A [**frontend**](frontend) written in [React](https://reactjs.org)/[Nextjs](https://nextjs.org) + [TypeScript](https://www.typescriptlang.org)
- Multiple [**backend services**](backend) written in [ASP.NET Core 5](https://docs.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-5.0)
- A [Spring Boot](https://spring.io/projects/spring-boot) [**wrapper**](fbsr-wrapper) around [Factorio-FBSR](https://github.com/demodude4u/Factorio-FBSR) that exposes a dockerised HTTP API to render blueprint images

You can find instructions on how to build and contribute to those components in the respective folders.
