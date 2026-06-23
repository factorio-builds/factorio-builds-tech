# Frontend Testing

Conventions for writing tests in `frontend/`. These are guidelines enforced by code review, not by tooling.

## Stack

- **Vitest** as the runner, configured in `frontend/vite.config.ts` (`environment: "jsdom"`, `globals: true`).
- **React Testing Library** (`@testing-library/react`) for rendering and querying.
- **Playwright** (`frontend/e2e/`) for end-to-end. Out of scope for this doc — covers golden-path browser flows only.

`npm test` runs the suite once; `npm run test:watch` runs in watch mode. Tests are picked up from `src/**/*.{test,spec}.{ts,tsx}`.

## The principle

**Test behavior at the boundary the user sees.** Tests should fail when behavior changes, not when implementation changes. Concretely:

- Query the DOM by role, label, or text. Reserve `data-testid` for cases with no semantic handle (icons, decorative containers).
- Assert on rendered output, dispatched actions, or network requests — not on internal state, props, or which child component happened to be used.
- Don't shallow-render. Don't mock children to "isolate" a parent. Render the real subtree.

## What to test, and how much of it

In descending order of how many tests you should write:

1. **Pure unit tests** — utils, reducers, selectors, parsers, formatters. No React, no DOM. Fastest and most stable. Examples: `src/utils/__tests__/blueprint.test.ts`, `src/utils/__tests__/rich-text.test.ts`.
2. **Component integration tests** — render a component (or small subtree), simulate user interaction, assert on what's rendered. This is the bulk of React testing. Example: `src/components/ui/RichText/__tests__/rich-text.test.tsx`.
3. **Hook tests** — only for hooks that meet the criteria below. Example: `src/hooks/__tests__/useDistributeToColumn.test.tsx`.
4. **E2E (Playwright)** — golden-path flows that cross real boundaries (auth, API, routing). Don't duplicate component coverage here; E2E is ~100× slower.

## Components vs. hooks — when to test which

**Default: test the component, not the hook.** If a hook is consumed by exactly one component, a `renderHook` test for it duplicates coverage and is less faithful than rendering the real consumer.

**Test the hook directly with `renderHook` when:**

- It's reused across multiple components (e.g. `useDistributeToColumn`).
- It encodes non-trivial logic with many input permutations that would be tedious to set up via component fixtures.
- It's a data-fetching/state hook whose public contract *is* the API, not the UI.

For hooks needing context (Redux, Router, Auth0), pass a `wrapper` to `renderHook` rather than mocking the context.

## File layout and naming

- Co-locate tests next to source under a `__tests__/` folder: `foo.ts` → `__tests__/foo.test.ts`.
- One test file per source file. If a file is large enough to want multiple test files, the source is probably too large.
- Top-level `describe` matches the unit under test: `describe("<RichText />", ...)` for a component, `describe("useDistributeToColumn", ...)` for a hook, `describe("blueprint utils", ...)` for a module.
- Snapshot files live under `__snapshots__/` next to the test (RTL/Vitest default).

## Patterns by layer

### Pure utils

Plain `describe`/`it` blocks, no React. Prefer `it.each` for permutations (see `useDistributeToColumn.test.tsx`). Fixtures big enough to be noisy go in a sibling `testdata/` folder (see `__tests__/testdata/blueprintMocks.ts`).

### Components

- Render with `render(<Component …/>)`. Query in this priority order (matching [Testing Library's query priority](https://testing-library.com/docs/queries/about/#priority)): `getByRole` → `getByLabelText` → `getByPlaceholderText` → `getByText` → `getByDisplayValue` → `getByAltText` → `getByTitle` → `getByTestId`. When you reach `getByTestId`, that's a signal the component has an accessibility gap, not a testing limitation.
- Use `@testing-library/user-event` for clicks, typing, and keyboard interaction. `fireEvent` skips real event sequences (focus, keydown ordering, etc.) and misses bugs `user-event` catches. Reach for `fireEvent` only for interactions `user-event` doesn't cover.
- **Modern `user-event` setup** (v14+): call `userEvent.setup()` once per test and use the returned instance. Don't use the legacy module-level `userEvent.click(...)` API.

  ```tsx
  it("submits the form", async () => {
    const user = userEvent.setup()
    render(<Form />)
    await user.type(screen.getByLabelText("Name"), "Alice")
    await user.click(screen.getByRole("button", { name: "Submit" }))
    expect(await screen.findByText("Thanks, Alice")).toBeTruthy()
  })
  ```
- Choose the right query family:
  - `getBy*` — must exist now. Throws if not. Use for synchronous assertions.
  - `findBy*` — will exist soon. Returns a promise that retries. Use for async assertions.
  - `queryBy*` — only to assert *absence* (`expect(queryByText(...)).toBeNull()`).
- Don't wrap `findBy*` in `waitFor` — it already retries. Reserve `waitFor` for non-DOM side effects (a mock was called, a request was made).

### Hooks

`renderHook` is exported from `@testing-library/react` directly — do not install the archived `@testing-library/react-hooks` package.

```ts
import { renderHook, act } from "@testing-library/react"

const { result, rerender } = renderHook(({ x }) => useThing(x), {
  initialProps: { x: 1 },
})
act(() => result.current.bump())
expect(result.current.value).toBe(2)
```

For hooks needing providers, pass `wrapper`:

```ts
renderHook(() => useFromStore(), { wrapper: ({ children }) => <Provider store={store}>{children}</Provider> })
```

Test the hook's *output* (final values, returned callbacks) rather than every intermediate state transition. The React Compiler can reorder and skip intermediate renders; tests that pin to specific render counts become flaky as compiler behavior tightens.

### Redux

Render with a real store seeded with the slice under test. **Do not mock `useSelector` or `useDispatch`** — those mocks rot the moment the slice shape changes. When you find yourself writing the same provider boilerplate twice, extract a `renderWithStore(ui, { preloadedState })` helper into `src/test/`.

### TanStack Router

For components calling `useNavigate`, `Link`, or loaders, build a real router in memory and render its `<RouterProvider />`. Don't mock `useNavigate`. Pattern:

```tsx
import { createMemoryHistory, createRouter, createRootRoute, createRoute, RouterProvider } from "@tanstack/react-router"

const rootRoute = createRootRoute()
const route = createRoute({ getParentRoute: () => rootRoute, path: "/", component: MyComponent })
const router = createRouter({
  routeTree: rootRoute.addChildren([route]),
  history: createMemoryHistory({ initialEntries: ["/"] }),
  defaultPendingMinMs: 0, // otherwise loaders add artificial delay in tests
})
render(<RouterProvider router={router} />)
```

Assert on the URL via `router.state.location.pathname` or on what the destination route renders after navigation. When this gets repetitive, extract a `renderWithRouter(component, { path, routes })` helper.

### TanStack Query

When/if this is adopted: give every test its own `QueryClient`. Never share clients across tests — cache bleed will bite. Mock at the network layer with MSW, not by stubbing the query hook.

```tsx
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, gcTime: 0 } },
})
render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
```

`retry: false` keeps failed-request assertions fast; `gcTime: 0` clears cache the moment the test unmounts.

### Network — MSW

Not yet wired into this repo. When component tests start needing realistic API responses, reach for **MSW** (`msw`) before reaching for `vi.mock("axios-hooks", …)`. MSW intercepts at the network layer, so the same handlers work for axios-hooks, fetch, and TanStack Query without coupling tests to the HTTP client.

Setup, when added:

```ts
// src/test/server.ts
import { setupServer } from "msw/node"
import { handlers } from "./handlers"
export const server = setupServer(...handlers)
```

```ts
// src/test/setupTests.ts (referenced from vite.config.ts → test.setupFiles)
import "@testing-library/jest-dom/vitest"
import { server } from "./server"
beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

`onUnhandledRequest: "error"` is deliberate — it forces every test to declare which endpoints it cares about, instead of silently letting real requests fall through.

### Authentication

The app uses a custom OIDC handler against IdentityServer (`src/routes/api/auth.$.ts`) with a session cookie — there is no `@auth0/auth0-react` provider to stub. For components that depend on the authenticated user:

- Once MSW lands, mock the `/api/auth/me` endpoint to return the desired session payload.
- Until then, if a test needs an authenticated state, factor the user lookup behind a small hook or context so tests can swap it. Don't reach into the route handler from a component test.

### Stitches / styling

Don't snapshot CSS or whole large components. Snapshots are appropriate for small, stable DOM where the output *is* the contract — e.g. the rich-text parser snapshot in `RichText/__tests__/__snapshots__/`. Avoid them for general components; they get rubber-stamped on every diff and stop catching anything.

## High-leverage rules

- **Arrange → act → assert.** If a test has two `act` blocks and three assertion clusters, split it.
- **Don't test the framework.** No tests verifying that `<Link>` navigates or that `useState` updates state. Test your logic.
- **Use `vi.useFakeTimers()`** for components with timeouts, intervals, or debounce. Otherwise tests are slow and flaky.
- **Import `@testing-library/jest-dom/vitest`** in a `setupTests.ts` (referenced from `vite.config.ts` `setupFiles`) when you start using matchers like `toBeInTheDocument`, `toHaveAttribute`. Currently the suite leans on `toBeTruthy()` — fine for now, but jest-dom matchers give better failure messages.
- **Skip with a TODO, don't delete.** When a test is broken by a known pre-existing issue, `it.skip` with an inline comment explaining what would need to change (see the `it.skip` in `useDistributeToColumn.test.tsx`).
- **No conditional logic in tests.** No `if`, no `try/catch` swallowing failures. If a test needs branches, it's really two tests.

## Helpers worth adding when the suite grows

These don't exist yet; add when the duplication starts to hurt:

- `src/test/setupTests.ts` — imports `@testing-library/jest-dom/vitest`, wired via `vite.config.ts` → `test.setupFiles`.
- `src/test/renderWithProviders.tsx` — wraps `render` with Router + Redux store. Accepts `{ preloadedState, route }`. Pays for itself by the third component test.
- `src/test/server.ts` — MSW server + default handlers, with lifecycle hooks in `setupTests.ts`.

## Further reading

- [Testing Library — Guiding Principles](https://testing-library.com/docs/guiding-principles)
- [Testing Library — Query priority](https://testing-library.com/docs/queries/about/#priority)
- [`user-event` v14 — Introduction](https://testing-library.com/docs/user-event/intro/) (the `userEvent.setup()` pattern)
- [Kent C. Dodds — "Common mistakes with React Testing Library"](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [TanStack Router — testing setup](https://tanstack.com/router/latest/docs/framework/react/how-to/setup-testing)
- [TanStack Query — testing guide](https://tanstack.com/query/latest/docs/framework/react/guides/testing)
- [MSW — Quick start](https://mswjs.io/docs/quick-start/) and [integrating with Vitest setup files](https://mswjs.io/docs/integrations/node)
- [Redux — Writing tests](https://redux.js.org/usage/writing-tests) (renders with a real preloaded store)
