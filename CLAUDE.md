# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Repository layout

Monorepo with three deployable components plus infra:

- **`backend/`** — ASP.NET Core 6, three projects: `FactorioTech.Api` (REST), `FactorioTech.Identity` (Duende IdentityServer), `FactorioTech.Core` (domain + EF). Tests in `backend/test/FactorioTech.Tests`.
- **`frontend/`** — TanStack Start + Vite + React + TypeScript. Routes are file-based under `src/routes/`. Stitches for CSS-in-JS. Auth0 via `@auth0/auth0-spa-js` (client) and a server route handler at `src/routes/api/auth.$.ts`.
- **`fbsr-wrapper/`** — Spring Boot HTTP wrapper around Factorio-FBSR for blueprint rendering.
- **`infrastructure/`**, **`deploy/`**, **`scripts/`**, **`.local/`** — infra-as-code, deploy configs, dev scripts, local secrets/volumes.

The full stack runs locally via `docker-compose up --detach --build --remove-orphans`. See `README.md` for OAuth/cert setup.

## Architecture references

Read the relevant doc before making non-trivial changes in a component:

- **Backend** — [`.claude/backend-architecture.md`](.claude/backend-architecture.md). Conventions for the ASP.NET Core projects: layering, `[AutoConstructor]` DI, sealed-record service results, rich domain entities, EF/Postgres patterns, view-model + HAL `_links` mapping, NodaTime, testing tiers.
- **Frontend testing** — [`.claude/frontend-testing.md`](.claude/frontend-testing.md). Vitest + RTL conventions: query priority, components-vs-hooks rules, TanStack Router/Query patterns, MSW guidance, and the test helpers worth adding as the suite grows.

(Frontend architecture and fbsr-wrapper docs not yet written — ask before authoring one.)

## General

- The backend is the source of truth for the OpenAPI spec; the frontend's API client is generated from it. Keep XML docs and `[ProducesResponseType]` accurate on controller actions.
- Don't mix concerns across project boundaries — `FactorioTech.Core` must not reference `FactorioTech.Api`.
- Don't introduce new DI frameworks, mappers (e.g. AutoMapper), or validation libraries — the existing patterns (`AutoConstructor`, hand-written `ToViewModel` extensions, DataAnnotations + `Hellang.Middleware.ProblemDetails`) are deliberate.
