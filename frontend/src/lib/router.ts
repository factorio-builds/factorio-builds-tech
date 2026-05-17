// next/router compat shim, mapped to TanStack Router.
//
// next 12's useRouter() returns:
//   { pathname, query, asPath, push(url, as?, opts?), replace(...), back(),
//     prefetch(), reload(), events, locale, isReady, ... }
//
// We expose the subset this codebase actually reads — keep this list narrow.

import {
  useLocation,
  useNavigate,
  useParams,
  useRouterState,
} from "@tanstack/react-router"

type Query = Record<string, string | string[] | undefined>

function parseQuery(search: string): Query {
  const params = new URLSearchParams(search)
  const out: Query = {}
  params.forEach((value, key) => {
    const existing = out[key]
    if (existing === undefined) {
      out[key] = value
    } else if (Array.isArray(existing)) {
      existing.push(value)
    } else {
      out[key] = [existing, value]
    }
  })
  return out
}

export interface NextRouterCompat {
  pathname: string
  asPath: string
  query: Query
  isReady: boolean
  push: (url: string) => Promise<boolean>
  replace: (url: string) => Promise<boolean>
  back: () => void
  reload: () => void
  prefetch: (_url: string) => Promise<void>
}

export function useRouter(): NextRouterCompat {
  const navigate = useNavigate()
  const location = useLocation()
  const isLoading = useRouterState({ select: (s) => s.isLoading })
  // Next 12's `router.query` merges dynamic route params and search params.
  // TanStack splits them, so we recombine here for API parity.
  const routeParams = useParams({ strict: false }) as Record<string, string>

  const push = (url: string) =>
    Promise.resolve(navigate({ to: url as never })).then(() => true)
  const replace = (url: string) =>
    Promise.resolve(navigate({ to: url as never, replace: true })).then(
      () => true
    )

  return {
    pathname: location.pathname,
    asPath: `${location.pathname}${location.searchStr ?? ""}`,
    query: { ...routeParams, ...parseQuery(location.searchStr ?? "") },
    isReady: !isLoading,
    push,
    replace,
    back: () => window.history.back(),
    reload: () => window.location.reload(),
    prefetch: () => Promise.resolve(),
  }
}

export type NextRouter = NextRouterCompat
