import { createFileRoute } from "@tanstack/react-router"
import { publicRuntimeConfig, serverRuntimeConfig } from "../../utils/config"

// Auth0/OIDC compat layer that mirrors the four endpoints the Next baseline
// exposed under /api/auth/[...auth0]:
//   login    -> 302 to the IdentityServer authorize endpoint
//   callback -> exchange code for tokens, set a session cookie
//   logout   -> clear cookie + 302 to IdentityServer end-session endpoint
//   me       -> return the decoded user from the session cookie
//
// Notes / scope:
// - Uses raw fetch against IdentityServer's well-known OIDC endpoints. The
//   real @auth0/nextjs-auth0 SDK does the same flow under the hood.
// - Without OAuth provider secrets configured (.local/secrets/), the
//   IdentityServer login page won't show GitHub/Discord. The login redirect
//   still works; the flow just can't complete.
// - State/PKCE is intentionally omitted for now — IdentityServer accepts the
//   simple code flow with client_secret. Add PKCE before going to prod.

const SESSION_COOKIE = "factorio_session"

interface TokenResponse {
  access_token: string
  id_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
}

interface IdTokenClaims {
  sub: string
  username?: string
  preferred_username?: string
  name?: string
  [k: string]: unknown
}

function b64UrlDecode(s: string): string {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/")
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4))
  if (typeof atob === "function") return atob(padded + pad)
  return Buffer.from(padded + pad, "base64").toString("binary")
}

function decodeJwt(token: string): IdTokenClaims | null {
  try {
    const [, payload] = token.split(".")
    return JSON.parse(b64UrlDecode(payload)) as IdTokenClaims
  } catch {
    return null
  }
}

function readSessionCookie(request: Request): TokenResponse | null {
  const header = request.headers.get("cookie") ?? ""
  for (const part of header.split(/;\s*/)) {
    if (part.startsWith(`${SESSION_COOKIE}=`)) {
      try {
        return JSON.parse(
          decodeURIComponent(part.slice(SESSION_COOKIE.length + 1))
        ) as TokenResponse
      } catch {
        return null
      }
    }
  }
  return null
}

function setSessionCookie(tokens: TokenResponse): string {
  const value = encodeURIComponent(JSON.stringify(tokens))
  // SameSite=Lax so the cookie is sent on the post-login redirect back from
  // the identity server. HttpOnly so JS can't read access tokens.
  return [
    `${SESSION_COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${tokens.expires_in ?? 3600}`,
  ].join("; ")
}

function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}

async function handleLogin(): Promise<Response> {
  const authorize = new URL("/connect/authorize", publicRuntimeConfig.identityUrl)
  authorize.searchParams.set("client_id", serverRuntimeConfig.clientId)
  authorize.searchParams.set("response_type", "code")
  authorize.searchParams.set("scope", "openid profile email api offline_access")
  authorize.searchParams.set(
    "redirect_uri",
    `${publicRuntimeConfig.webUrl}/api/auth/callback`
  )
  return Response.redirect(authorize.toString(), 302)
}

async function handleCallback(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  if (!code) {
    return new Response("Missing authorization code", { status: 400 })
  }

  const tokenUrl = new URL("/connect/token", publicRuntimeConfig.identityUrl)
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: serverRuntimeConfig.clientId,
    client_secret: serverRuntimeConfig.clientSecret,
    redirect_uri: `${publicRuntimeConfig.webUrl}/api/auth/callback`,
  })

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    return new Response(`Token exchange failed: ${text}`, { status: 502 })
  }

  const tokens = (await res.json()) as TokenResponse
  return new Response(null, {
    status: 302,
    headers: {
      Location: publicRuntimeConfig.webUrl,
      "set-cookie": setSessionCookie(tokens),
    },
  })
}

async function handleLogout(): Promise<Response> {
  const endSession = new URL(
    "/connect/endsession",
    publicRuntimeConfig.identityUrl
  )
  endSession.searchParams.set(
    "post_logout_redirect_uri",
    publicRuntimeConfig.webUrl
  )
  return new Response(null, {
    status: 302,
    headers: {
      Location: endSession.toString(),
      "set-cookie": clearSessionCookie(),
    },
  })
}

function handleMe(request: Request): Response {
  const tokens = readSessionCookie(request)
  if (!tokens) {
    return new Response(JSON.stringify(null), {
      status: 401,
      headers: { "content-type": "application/json" },
    })
  }
  const claims = decodeJwt(tokens.id_token)
  if (!claims) {
    return new Response(JSON.stringify(null), {
      status: 401,
      headers: { "content-type": "application/json" },
    })
  }
  return Response.json({
    user: {
      sub: claims.sub,
      username:
        (claims.username as string) ??
        (claims.preferred_username as string) ??
        claims.name,
    },
    accessToken: tokens.access_token,
  })
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const action = params._splat?.split("/")[0]
        switch (action) {
          case "login":
            return handleLogin()
          case "callback":
            return handleCallback(request)
          case "logout":
            return handleLogout()
          case "me":
            return handleMe(request)
          default:
            return new Response(`Unknown auth action: ${action}`, {
              status: 404,
            })
        }
      },
    },
  },
})
