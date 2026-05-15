# fbsr

Thin Docker wrapper around upstream [`demodude4u/Factorio-FBSR`](https://github.com/demodude4u/Factorio-FBSR). Replaces the old Spring Boot `fbsr-wrapper` directory.

The image builds upstream FBSR at container build time and runs `bot-run` with the Web API enabled at runtime. The Web API contract (`POST /blueprint`, snake-case JSON body, `image/png` response when `return-single-image: true`) is consumed by [`backend/src/FactorioTech.Core/Services/FbsrClient.cs`](../backend/src/FactorioTech.Core/Services/FbsrClient.cs).

## First-run prerequisites

The first time the `fbsr-data` volume is empty, the container builds a profile from scratch. This requires:

1. **A Factorio install** mounted into the container (the same `.local/volumes/factorio` mount the project has always used, but it must be **read-write** now because FBSR shells out to the Factorio binary to dump `data.raw`).
2. **Mod portal credentials**, used to download `space-age`, `quality`, and `elevated-rails`. Set:
    ```
    MODPORTAL_USERNAME=<your factorio.com username>
    MODPORTAL_PASSWORD=<your factorio.com password>
    ```
    These flow in through `docker-compose.yaml` env vars (or `.local/secrets`).

After the first build, the resulting `profiles/`, `build/`, and `assets/` directories live in the `fbsr-data` named volume and subsequent boots skip straight to `bot-run`.

## Knobs (env vars)

| Var | Default | Purpose |
|---|---|---|
| `FACTORIO_INSTALL` | _(required on first run)_ | Path to Factorio install (typically `/mnt/factorio`) |
| `MODPORTAL_USERNAME` | _(required on first run)_ | Factorio mod portal username |
| `MODPORTAL_PASSWORD` | _(required on first run)_ | Factorio mod portal password |
| `FBSR_PROFILE` | `vanilla` | Profile name; must exist or be `vanilla` (auto-created) |
| `FBSR_WEBAPI_PORT` | `8080` | Web API bind port |
| `FBSR_BUILD_HEAP` | `12g` | `-Xmx` value for the one-time asset build |
| `FBSR_FORCE_REBUILD` | unset | Set to `1` to regenerate the profile on next start |

## Layout

- `Dockerfile` — multi-stage build, pins three upstream repos via `ARG`s (see `FBSR_REF`, `FDW_REF`, `DCBA_REF`).
- `entrypoint.sh` — writes `config.json` on first boot, runs `profile-default-vanilla` + `build`, then `bot-run`.

## Bumping upstream

```sh
# Verify upstream master is healthy
gh api repos/demodude4u/Factorio-FBSR/commits/master --jq '.sha,.commit.message'

# Pin to a specific SHA in docker-compose.yaml or as a build arg:
docker build \
  --build-arg FBSR_REF=<sha> \
  --build-arg FDW_REF=<sha> \
  --build-arg DCBA_REF=<sha> \
  fbsr
```

Treat upstream bumps the same way as any other vendored dep: test that `POST /blueprint` still returns PNG bytes against a fixture blueprint before rolling out.
