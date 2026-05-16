// Minimal Node HTTP shim that hosts the compiled TanStack Start server
// alongside the static client bundle. The default `dev` script handles this
// via Vite middleware; for the production server we just bridge Node's
// http.Server to the standard Web fetch handler the build emits.
import { createServer } from "node:http"
import { createReadStream, statSync, existsSync } from "node:fs"
import { createGzip } from "node:zlib"
import { extname, join } from "node:path"
import { fileURLToPath } from "node:url"
import server from "./dist/server/server.js"

const here = fileURLToPath(new URL(".", import.meta.url))
const clientDir = join(here, "dist/client")
const publicDir = join(here, "public")
const port = Number(process.env.PORT ?? 3001)

const mimeMap = {
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
}

function shouldCompress(ext) {
  return [".js", ".mjs", ".css", ".html", ".json", ".svg"].includes(ext)
}

function serveStaticFile(filePath, req, res) {
  try {
    const stat = statSync(filePath)
    if (!stat.isFile()) return false
    const ext = extname(filePath)
    const acceptsGzip = (req.headers["accept-encoding"] ?? "").includes("gzip")
    const baseHeaders = {
      "content-type": mimeMap[ext] ?? "application/octet-stream",
      "cache-control": req.url.includes("/assets/")
        ? "public, max-age=31536000, immutable"
        : "public, max-age=300",
    }
    if (acceptsGzip && shouldCompress(ext)) {
      res.writeHead(200, {
        ...baseHeaders,
        "content-encoding": "gzip",
        vary: "accept-encoding",
      })
      createReadStream(filePath).pipe(createGzip()).pipe(res)
    } else {
      res.writeHead(200, { ...baseHeaders, "content-length": stat.size })
      createReadStream(filePath).pipe(res)
    }
    return true
  } catch {
    return false
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`)

  // 1) /assets/* → client bundle
  if (url.pathname.startsWith("/assets/")) {
    const filePath = join(clientDir, url.pathname)
    if (existsSync(filePath) && serveStaticFile(filePath, req, res)) return
  }

  // 2) Anything that looks like a static asset → public/ first, then client/
  if (url.pathname !== "/" && /\.[a-zA-Z0-9]+$/.test(url.pathname)) {
    const publicPath = join(publicDir, url.pathname)
    if (existsSync(publicPath) && serveStaticFile(publicPath, req, res)) return
    const clientPath = join(clientDir, url.pathname)
    if (existsSync(clientPath) && serveStaticFile(clientPath, req, res)) return
  }

  // 3) Fall through to the SSR handler (uses Web Fetch API).
  const headers = new Headers()
  for (const [k, v] of Object.entries(req.headers)) {
    if (Array.isArray(v)) v.forEach((vv) => headers.append(k, vv))
    else if (v) headers.set(k, v)
  }
  const init = {
    method: req.method,
    headers,
    body:
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : req,
    duplex: "half",
  }
  try {
    const response = await server.fetch(new Request(url.toString(), init))
    res.writeHead(response.status, Object.fromEntries(response.headers))
    if (response.body) {
      const reader = response.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value)
      }
    }
    res.end()
  } catch (err) {
    console.error(err)
    if (!res.headersSent) res.writeHead(500)
    res.end(String(err))
  }
}).listen(port, () => {
  console.log(`TSS prod server: http://localhost:${port}`)
})
