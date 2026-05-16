# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Repository layout

Monorepo with three deployable components plus infra:

- **`backend/`** — ASP.NET Core 6, three projects: `FactorioTech.Api` (REST), `FactorioTech.Identity` (Duende IdentityServer), `FactorioTech.Core` (domain + EF). Tests in `backend/test/FactorioTech.Tests`.
- **`frontend/`** — Next.js + React + TypeScript.
- **`fbsr-wrapper/`** — Spring Boot HTTP wrapper around Factorio-FBSR for blueprint rendering.
- **`infrastructure/`**, **`deploy/`**, **`scripts/`**, **`.local/`** — infra-as-code, deploy configs, dev scripts, local secrets/volumes.

The full stack runs locally via `docker-compose up --detach --build --remove-orphans`. See `README.md` for OAuth/cert setup.

## Architecture references

Read the relevant doc before making non-trivial changes in a component:

- **Backend** — [`.claude/backend-architecture.md`](.claude/backend-architecture.md). Conventions for the ASP.NET Core projects: layering, `[AutoConstructor]` DI, sealed-record service results, rich domain entities, EF/Postgres patterns, view-model + HAL `_links` mapping, NodaTime, testing tiers.

(Frontend and fbsr-wrapper docs not yet written — ask before authoring one.)

## General

- The backend is the source of truth for the OpenAPI spec; the frontend's API client is generated from it. Keep XML docs and `[ProducesResponseType]` accurate on controller actions.
- Don't mix concerns across project boundaries — `FactorioTech.Core` must not reference `FactorioTech.Api`.
- Don't introduce new DI frameworks, mappers (e.g. AutoMapper), or validation libraries — the existing patterns (`AutoConstructor`, hand-written `ToViewModel` extensions, DataAnnotations + `Hellang.Middleware.ProblemDetails`) are deliberate.
