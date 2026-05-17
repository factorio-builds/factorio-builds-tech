// HMAC-SHA256 signed cookies. Format: `<b64url(json)>.<b64url(hmac)>`.
// Used for the short-lived auth transaction cookie and the session cookie so
// the server can detect tampering without trusting cookie contents blindly.

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function b64urlEncode(bytes: Uint8Array): string {
  let s = ""
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function b64urlDecode(s: string): Uint8Array<ArrayBuffer> {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/")
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4))
  const bin = atob(padded + pad)
  const out = new Uint8Array(new ArrayBuffer(bin.length))
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

export async function signCookie<T>(payload: T, secret: string): Promise<string> {
  const body = b64urlEncode(encoder.encode(JSON.stringify(payload)))
  const key = await importKey(secret)
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body))
  return `${body}.${b64urlEncode(new Uint8Array(sig))}`
}

export async function verifyCookie<T>(
  signed: string,
  secret: string
): Promise<T | null> {
  const dot = signed.indexOf(".")
  if (dot <= 0 || dot === signed.length - 1) return null
  const body = signed.slice(0, dot)
  const sig = b64urlDecode(signed.slice(dot + 1))
  const key = await importKey(secret)
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    sig,
    encoder.encode(body)
  )
  if (!ok) return null
  try {
    return JSON.parse(decoder.decode(b64urlDecode(body))) as T
  } catch {
    return null
  }
}
