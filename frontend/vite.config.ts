/// <reference types="vitest" />
import { defineConfig } from "vite"
import viteReact from "@vitejs/plugin-react"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import tsconfigPaths from "vite-tsconfig-paths"
import webpackStats from "rollup-plugin-webpack-stats"

export default defineConfig({
  server: {
    port: 3000,
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  ssr: {
    // Force vite to bundle these CJS-flavored packages so their named exports
    // resolve in SSR. Without this Node refuses to extract named exports from
    // CJS modules and the SSR pass blows up.
    noExternal: ["react-use", "react-redux", "axios-hooks", "lru-cache"],
  },
  resolve: {
    // Prefer the ESM build of packages that ship both — otherwise vite picks
    // the `main` (CJS) entry for SSR and we run into named-export issues.
    mainFields: ["module", "browser", "main"],
  },
  plugins: [
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      target: "node-server",
      customViteReactPlugin: true,
    }),
    viteReact(),
    // Bundle stats consumed by .github/workflows/relative-ci.yml.
    // rollup-plugin-webpack-stats transforms Vite's rollup output into the
    // webpack-stats-compatible JSON format the RelativeCI agent expects.
    // Default output path: dist/webpack-stats.json.
    webpackStats(),
  ],
})
