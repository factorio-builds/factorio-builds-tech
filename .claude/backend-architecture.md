# Backend Architecture

ASP.NET Core 6 monolith split into three projects under `backend/src/`. Follow the patterns described here when adding or modifying backend code — they are conventions enforced by code review, not by tooling.

## Projects

```
backend/src/
├── FactorioTech.Api/         # HTTP layer: controllers, view models, mappers, link builders
├── FactorioTech.Core/        # Domain model, EF Core context, business services
└── FactorioTech.Identity/    # Duende IdentityServer + ASP.NET Identity (separate host)
backend/test/FactorioTech.Tests/
```

`Api` references `Core`. `Identity` references `Core`. `Core` references nothing in this solution. **Domain types and services live in `Core`. HTTP/JSON concerns live in `Api`. Never reverse this dependency.**

## Layering — request flow

```
HTTP request
   │
   ▼
Controller (Api/Controllers)        ← thin: parse request, call service, switch on result, map to view model
   │
   ▼
Service (Core/Services)             ← business logic, returns discriminated-union result records
   │
   ▼
AppDbContext (Core/Data)            ← EF Core, Postgres-only features OK (jsonb, tsvector)
   │
   ▼
Domain entity (Core/Domain)         ← rich model: private setters, behavior methods, `private` ctor for EF
```

A controller action should usually be: validate cover/file → call service → `switch` on the result record → map domain to view model via `ToViewModel(...)` extension. See `Api/Controllers/BuildController.cs` for the canonical example.

## Conventions

### Constructor injection via `AutoConstructor`

Every service and controller is `public partial class` decorated with `[AutoConstructor]`. Declare dependencies as `private readonly` fields; the source generator emits the constructor.

```csharp
[ApiController]
[AutoConstructor]
[Route("builds")]
public partial class BuildController : ControllerBase
{
    private readonly AppDbContext dbContext;
    private readonly BuildService buildService;
    // no constructor — AutoConstructor generates it
}
```

Don't write the constructor by hand. Don't introduce a DI framework on top.

### Service result records (discriminated unions)

Services that can fail in distinct, expected ways return a sealed `record` hierarchy. Controllers `switch` on the result and map each case to the appropriate HTTP response. Do **not** throw exceptions for expected business failures (not-found, conflict, unauthorized).

Example shape (see `BuildService.CreateResult`):

```csharp
public record CreateResult
{
    public sealed record Success(Build Build) : CreateResult;
    public sealed record BuildNotFound(string Owner, string Slug) : CreateResult;
    public sealed record NotAuthorized(Guid UserId) : CreateResult;
    public sealed record DuplicateHash(...) : CreateResult;
    private CreateResult() { }   // seals the hierarchy
}
```

Controller side:

```csharp
return result switch
{
    BuildService.CreateResult.Success success => Created(...),
    BuildService.CreateResult.NotAuthorized _ => Forbid(),
    BuildService.CreateResult.BuildNotFound error => NotFound(error.ToProblem()),
    _ => BadRequest(result.ToProblem()),
};
```

`ToProblem()` (in `ViewModelMapper`) wraps the result record into RFC 7807 `ProblemDetails` with the type name and trace id.

### Domain entities

Located in `Core/Domain`. Rules:

- `[Key]` `Guid` ids, `init`-only.
- All persisted properties decorated with DataAnnotations (`[Required]`, `[MaxLength]`).
- **Private setters with behavior methods** for mutation (e.g. `Build.UpdateDetails(...)`, `Build.UpdateLatestVersion(...)`). Don't expose public setters; mutate through methods that enforce invariants and update `UpdatedAt`.
- `init`-only navigation properties; comment `// navigation properties -> will be null if not included explicitly`.
- Empty `private Build() { }` ctor wrapped in `#pragma warning disable 8618` for EF materialization.
- Denormalized fields (e.g. `NormalizedSlug`, `OwnerSlug`) live on the entity for query performance — keep them in sync inside the constructor / mutator methods.

### Database access

- Single `AppDbContext` (`Core/Data/AppDbContext.cs`). It extends `PersistedGrantIdentityContext` so IdentityServer tables share the schema.
- Entity configuration is centralised in `OnModelCreating`. New entities → add a `DbSet`, register in `OnModelCreating`, generate a migration:
  ```bash
  dotnet ef migrations add "xxx" -o Data/Migrations -c AppDbContext \
      -p src/FactorioTech.Core/FactorioTech.Core.csproj
  ```
- Read queries use `.AsNoTracking()`. Tracked queries are reserved for code that mutates and calls `SaveChangesAsync()`.
- Includes are explicit (`.Include(b => b.LatestVersion!).ThenInclude(v => v.Payload)`); navigation properties are nullable and assumed `null` unless included.
- Multi-step writes are wrapped in `await using var tx = await dbContext.Database.BeginTransactionAsync();` (see `BuildService.CreateOrAddVersion`).
- Postgres-specific features are fine (`jsonb`, generated `tsvector` columns, GIN indexes); guard with `if (Database.IsNpgsql())` only when a feature truly needs to fall back (e.g. for in-memory tests).

### Time

NodaTime everywhere. Never use `DateTime`/`DateTimeOffset` on persisted properties or in service signatures. Inject the clock as `SystemClock.Instance.GetCurrentInstant()`. JSON serialization is configured in `Startup.ConfigureServices` via `ConfigureForNodaTime`.

### Authorization

- `[Authorize]` on actions that require a logged-in user; `[Authorize(Roles = Role.Administrator)]` for role-gated actions (`Role` constants in `Core/Domain/Role.cs`).
- Per-resource permissions are extension methods on `ClaimsPrincipal` in `Core/IdentityExtensions.cs` (`CanEdit`, `CanAddVersion`, `CanDelete`, `CanDeleteRendering`). Add new permission checks here, not inline in controllers/services.
- User id from the principal: `principal.GetUserId()` (throws) or `principal.TryGetUserId()` (nullable). Username: `principal.GetUserName()`.

## API layer (`FactorioTech.Api`)

### View models

Located in `Api/ViewModels`. Never expose domain entities directly — always map to a view model. Patterns:

- A "Thin" model for list endpoints, a "Full" model for detail endpoints (`ThinBuildModel`, `FullBuildModel`).
- All view models inherit `ViewModelBase<TLinks>` which carries a `_links` HAL-style envelope. `TLinks` is a per-resource link record (e.g. `ThinBuildLinks`, `FullBuildLinks`).
- View models declare `[Required]`, `StringLength`, `RegularExpression`, etc. — these flow into the OpenAPI spec and are used by Swashbuckle.
- Polymorphic payloads (`PayloadModelBase` → `BlueprintPayloadModel` / `BookPayloadModel`) use `PolymorphicJsonConverter` registered in `Startup`.

### Mapping

`Api/Services/ViewModelMapper.cs` contains static `ToViewModel` / `ToThinViewModel` / `ToFullViewModel` extension methods. Mapping is the **only** way a domain object reaches the wire. Keep mappers pure — no DB calls, no I/O. If a mapper needs more data (e.g. follower flag, decoded blueprint envelope), the caller fetches it and passes it as an argument.

### Hypermedia links

`Api/Services/LinkBuilder.cs` builds the `_links` envelope using `IUrlHelper.ActionLink(nameof(...), "Controller", values)` so renames stay refactor-safe. Action links are conditionally included based on the current user's permissions — the response advertises only the actions the caller is allowed to perform. When you add a new action, also add a corresponding link (or a permission-gated link) here.

### Requests

POST/PATCH/PUT bodies live in `Api/ViewModels/Requests/`. Multi-part uploads (cover image + json) use `[FromForm]` with a `CreateRequestBase`-style class. Plain JSON requests use `[FromBody]`.

### JSON / serialization

Configured once in `Startup.ConfigureServices`:
- `snake_case` property names and enum values (`SnakeCaseNamingPolicy`).
- NodaTime via `ConfigureForNodaTime`.
- Custom converters for `Hash`, `Version`, polymorphic payloads.
- `JsonIgnoreCondition.WhenWritingNull` — null fields are omitted from responses.

Don't introduce per-controller serializer settings; extend the global config.

### Errors

`Hellang.Middleware.ProblemDetails` translates exceptions and `ProblemDetails` results into RFC 7807 responses. Throw `ProblemDetailsException(new ValidationProblemDetails(ModelState))` for input validation that can't be expressed as DataAnnotations (see `BuildController.SaveTempCover`). Otherwise prefer the result-record pattern over throwing.

### Swagger / OpenAPI

XML doc comments on actions and models are required (`<GenerateDocumentationFile>true</GenerateDocumentationFile>`). Every action should declare:
- `[Produces]` / `[Consumes]` media types,
- `[ProducesResponseType]` for each documented status,
- `<summary>`, `<param>`, `<response>` doc comments.

The frontend's API client is generated from the Swagger spec, so accuracy matters.

## Services (`Core/Services`)

| Service | Responsibility |
|---|---|
| `BuildService` | CRUD for builds and versions; pagination, search, sort |
| `FollowerService` | Favorites (follow/unfollow), follower listing |
| `ImageService` | Cover upload/crop, blueprint rendering via FBSR, Azure Blob storage |
| `AssetService` | Game icon resolution |
| `SlugService` | Slug/username validation + availability check |
| `BlueprintConverter` | Encode/decode Factorio blueprint strings |
| `FbsrClient` | HTTP client for the `fbsr-wrapper` rendering service |
| `TempCoverHandle` | RAII handle for the two-phase cover upload (uploaded to temp blob, then promoted on commit) |

Add new business logic to a service. Controllers should not contain logic beyond request shaping, result switching, and view-model mapping.

## Testing (`backend/test/FactorioTech.Tests`)

- xUnit + FluentAssertions.
- Tag tests with `[Trait("Type", "Fast")]` for in-memory unit tests and `[Trait("Type", "Slow")]` for integration tests that spin up Postgres via Testcontainers. Run subsets via `dotnet test --filter Type=Fast` or `Type=Slow`.
- Slow integration tests use `IAsyncLifetime` to start a real `postgres:latest` container and run migrations against it — do **not** mock `AppDbContext`.
- Test data construction goes through fluent builders in `test/Helpers/` (`BuildBuilder`, `PayloadBuilder`, `UserBuilder`). Add to these builders rather than inlining test fixtures.

## When adding a new feature, follow this order

1. Domain entity in `Core/Domain` (with private setters + behavior methods + private EF ctor).
2. Register on `AppDbContext` in `Core/Data` and generate a migration.
3. Service in `Core/Services` with `[AutoConstructor]` and a result-record hierarchy if the operation can fail in multiple ways.
4. Register the service in `Startup.ConfigureServices` (`AddTransient`).
5. Request model in `Api/ViewModels/Requests`, view model + links in `Api/ViewModels`.
6. Mapper extension in `Api/Services/ViewModelMapper.cs` and links in `Api/Services/LinkBuilder.cs`.
7. Controller action in `Api/Controllers` — `[Authorize]` as needed, full XML docs, `ProducesResponseType` for every status, `switch` on the service result.
8. Slow integration test under `test/FactorioTech.Tests` using a builder.
