import { createFileRoute } from "@tanstack/react-router"
import * as client from "openid-client"
import { publicRuntimeConfig, serverRuntimeConfig } from "../../utils/config"
import { signCookie, verifyCookie } from "../../utils/signed-cookie"

// OIDC auth flow against IdentityServer. Four actions under /api/auth/$:
//   login    -> generates PKCE + state, sets tx cookie, 302 to authorize
//   callback -> validates state, exchanges code (with PKCE), sets session cookie
//   logout   -> clears session, 302 to end_session
//   me       -> returns decoded user from the (signed) session cookie

const TX_COOKIE = "auth_tx"
const SESSION_COOKIE = "factorio_session"
const TX_MAX_AGE_S = 600
const REDIRECT_PATH = "/api/auth/callback"

interface TxCookie {
  state: string
  code_verifier: string
}

interface SessionCookie {
  access_token: string
  id_token: string
  refresh_token?: string
  expires_at: number
}

interface IdTokenClaims {
  sub: string
  username?: string
  preferred_username?: string
  name?: string
  [k: string]: unknown
}

let configPromise: Promise<client.Configuration> | undefined

function getOidcConfig(): Promise<client.Configuration> {
  if (!configPromise) {
    configPromise = client.discovery(
      new URL(publicRuntimeConfig.identityUrl),
      serverRuntimeConfig.clientId,
      undefined,
      client.ClientSecretPost(serverRuntimeConfig.clientSecret)
    )
  }
  return configPromise
}

function redirectUri(): string {
  return `${publicRuntimeConfig.webUrl}${REDIRECT_PATH}`
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie") ?? ""
  for (const part of header.split(/;\s*/)) {
    if (part.startsWith(`${name}=`)) {
      return decodeURIComponent(part.slice(name.length + 1))
    }
  }
  return null
}

function setCookieHeader(name: string, value: string, maxAgeSeconds: number): string {
  return [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ].join("; ")
}

function clearCookieHeader(name: string): string {
  return `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}

function decodeIdTokenPayload(idToken: string): IdTokenClaims | null {
  // The session cookie's HMAC signature is our integrity check — the id_token
  // inside was already JWKS-verified by openid-client at callback time.
  try {
    const [, payload] = idToken.split(".")
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/")
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4))
    return JSON.parse(atob(padded + pad)) as IdTokenClaims
  } catch {
    return null
  }
}

async function handleLogin(): Promise<Response> {
  const config = await getOidcConfig()
  const code_verifier = client.randomPKCECodeVerifier()
  const code_challenge = await client.calculatePKCECodeChallenge(code_verifier)
  const state = client.randomState()

  const url = client.buildAuthorizationUrl(config, {
    redirect_uri: redirectUri(),
    scope: "openid profile email api offline_access",
    code_challenge,
    code_challenge_method: "S256",
    state,
  })

  const txCookie = await signCookie<TxCookie>(
    { state, code_verifier },
    serverRuntimeConfig.cookieSecret
  )

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      "set-cookie": setCookieHeader(TX_COOKIE, txCookie, TX_MAX_AGE_S),
    },
  })
}

async function handleCallback(request: Request): Promise<Response> {
  const signedTx = readCookie(request, TX_COOKIE)
  if (!signedTx) {
    return new Response("Missing auth transaction cookie", { status: 400 })
  }
  const tx = await verifyCookie<TxCookie>(
    signedTx,
    serverRuntimeConfig.cookieSecret
  )
  if (!tx) {
    return new Response("Invalid auth transaction cookie", { status: 400 })
  }

  const config = await getOidcConfig()
  const tokens = await client.authorizationCodeGrant(
    config,
    new URL(request.url),
    {
      expectedState: tx.state,
      pkceCodeVerifier: tx.code_verifier,
    }
  )

  if (!tokens.id_token) {
    return new Response("Token response missing id_token", { status: 502 })
  }

  const session: SessionCookie = {
    access_token: tokens.access_token,
    id_token: tokens.id_token,
    refresh_token: tokens.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (tokens.expires_in ?? 3600),
  }
  const signedSession = await signCookie<SessionCookie>(
    session,
    serverRuntimeConfig.cookieSecret
  )

  const headers = new Headers({ Location: publicRuntimeConfig.webUrl })
  headers.append(
    "set-cookie",
    setCookieHeader(SESSION_COOKIE, signedSession, tokens.expires_in ?? 3600)
  )
  headers.append("set-cookie", clearCookieHeader(TX_COOKIE))

  return new Response(null, { status: 302, headers })
}

async function handleLogout(request: Request): Promise<Response> {
  const config = await getOidcConfig()
  const signedSession = readCookie(request, SESSION_COOKIE)
  const session = signedSession
    ? await verifyCookie<SessionCookie>(
        signedSession,
        serverRuntimeConfig.cookieSecret
      )
    : null

  const url = client.buildEndSessionUrl(config, {
    post_logout_redirect_uri: publicRuntimeConfig.webUrl,
    ...(session?.id_token ? { id_token_hint: session.id_token } : {}),
  })

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      "set-cookie": clearCookieHeader(SESSION_COOKIE),
    },
  })
}

async function handleMe(request: Request): Promise<Response> {
  const signedSession = readCookie(request, SESSION_COOKIE)
  if (!signedSession) {
    return Response.json(null, { status: 401 })
  }
  const session = await verifyCookie<SessionCookie>(
    signedSession,
    serverRuntimeConfig.cookieSecret
  )
  if (!session || session.expires_at <= Math.floor(Date.now() / 1000)) {
    return Response.json(null, { status: 401 })
  }
  const claims = decodeIdTokenPayload(session.id_token)
  if (!claims) {
    return Response.json(null, { status: 401 })
  }
  return Response.json({
    user: {
      sub: claims.sub,
      username:
        (claims.username as string) ??
        (claims.preferred_username as string) ??
        claims.name,
    },
    accessToken: session.access_token,
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
            return handleLogout(request)
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
