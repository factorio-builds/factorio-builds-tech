// Vite/TanStack-Start replacement for Next.js getConfig().
// Reads VITE_* env at build time on the client, and process.env on the server.
// Shape mirrors the Next runtime config used throughout the codebase so the
// import sites can stay identical.

const env =
  typeof process !== "undefined" && process.env
    ? process.env
    : (import.meta as unknown as { env: Record<string, string | undefined> }).env

function read(name: string): string | undefined {
  return env[name] ?? env[`VITE_${name}`]
}

export const publicRuntimeConfig = {
  webUrl: read("WEB_URL") ?? "http://localhost:3000",
  apiUrl: read("API_URL") ?? "https://api.local.factorio.tech",
  identityUrl: read("IDENTITY_URL") ?? "https://identity.local.factorio.tech",
  cdnUrl: read("CDN_URL") ?? "https://api.local.factorio.tech/assets",
  enableApplicationInsights: read("ENABLE_APPLICATION_INSIGHTS") ?? "false",
  instrumentationKey: read("INSTRUMENTATION_KEY"),
}

export const serverRuntimeConfig = {
  clientId: read("CLIENT_ID") ?? "frontend",
  clientSecret:
    read("CLIENT_SECRET") ?? "511536EF-F270-4058-80CA-1C89C192F69A",
  // HMAC key for the auth transaction + session cookies. Dev default is
  // intentionally well-known; override COOKIE_SECRET in any deployed env.
  cookieSecret:
    read("COOKIE_SECRET") ?? "dev-cookie-secret-change-me-in-prod",
}

export default function getConfig() {
  return { publicRuntimeConfig, serverRuntimeConfig }
}
