import qs from "qs"
import { publicRuntimeConfig } from "./config"
import type { IProblemDetails } from "../types/models"

export interface HttpResponse<T> {
  data: T
  status: number
}

export class HttpError<T = IProblemDetails> extends Error {
  readonly response: { status: number; data: T | undefined }

  constructor(status: number, data: T | undefined, message?: string) {
    super(message ?? `Request failed with status ${status}`)
    this.name = "HttpError"
    this.response = { status, data }
  }
}

export interface HttpRequestOptions {
  params?: Record<string, unknown>
  data?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
  accessToken?: string
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

function buildUrl(path: string, params?: Record<string, unknown>): string {
  const base = publicRuntimeConfig.apiUrl.replace(/\/$/, "")
  const url = path.startsWith("http") ? path : `${base}${path}`
  if (!params) return url
  const search = qs.stringify(params, {
    arrayFormat: "brackets",
    skipNulls: true,
  })
  return search ? `${url}?${search}` : url
}

async function request<T>(
  method: Method,
  path: string,
  opts: HttpRequestOptions = {}
): Promise<HttpResponse<T>> {
  const headers: Record<string, string> = { ...opts.headers }
  let body: BodyInit | undefined

  if (opts.data instanceof FormData) {
    body = opts.data
  } else if (opts.data !== undefined) {
    body = JSON.stringify(opts.data)
    if (!headers["content-type"] && !headers["Content-Type"]) {
      headers["content-type"] = "application/json"
    }
  }

  if (opts.accessToken) {
    headers.Authorization = `Bearer ${opts.accessToken}`
  }

  const res = await fetch(buildUrl(path, opts.params), {
    method,
    headers,
    body,
    signal: opts.signal,
  })

  let data: unknown
  if (res.status !== 204 && res.status !== 205) {
    const contentType = res.headers.get("content-type") ?? ""
    if (contentType.includes("application/json")) {
      data = await res.json().catch(() => undefined)
    } else {
      const text = await res.text()
      data = text || undefined
    }
  }

  if (!res.ok) {
    throw new HttpError(res.status, data as IProblemDetails | undefined)
  }

  return { data: data as T, status: res.status }
}

export const http = {
  get: <T>(path: string, opts?: HttpRequestOptions) =>
    request<T>("GET", path, opts),
  post: <T>(path: string, opts?: HttpRequestOptions) =>
    request<T>("POST", path, opts),
  put: <T>(path: string, opts?: HttpRequestOptions) =>
    request<T>("PUT", path, opts),
  patch: <T>(path: string, opts?: HttpRequestOptions) =>
    request<T>("PATCH", path, opts),
  delete: <T>(path: string, opts?: HttpRequestOptions) =>
    request<T>("DELETE", path, opts),
}
