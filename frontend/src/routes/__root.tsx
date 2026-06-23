import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { QueryClientProvider } from "@tanstack/react-query"
import { SSRProvider } from "@react-aria/ssr"
import type { ReactNode } from "react"
import { Provider as ReduxProvider } from "react-redux"
import { useEffect, useMemo } from "react"
import { getCssText, globalStyles } from "../design/stitches.config"
import { mediaStyles, MediaContextProvider } from "../design/styles/media"
import { makeStore } from "../redux/store"
import type { RouterContext } from "../router"
import { publicRuntimeConfig } from "../utils/config"
import { AppInsightsContext } from "@microsoft/applicationinsights-react-js"
import { initAppInsights, reactPlugin } from "../lib/appInsights"

// Inject the static global styles into Stitches' registry at module load so
// getCssText() picks them up on first render.
globalStyles()

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "initial-scale=1.0, width=device-width" },
      { title: "Factorio Builds" },
      { name: "msapplication-TileColor", content: "#1a161d" },
      { name: "theme-color", content: "#1a161d" },
    ],
    links: [
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#1a161d" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=JetBrains+Mono&display=swap",
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  const { queryClient } = Route.useRouteContext()
  const store = useMemo(() => makeStore(), [])

  useEffect(() => {
    if (publicRuntimeConfig.enableApplicationInsights === "true") {
      initAppInsights(publicRuntimeConfig.instrumentationKey)
    }
  }, [])

  return (
    <RootDocument>
      <AppInsightsContext.Provider value={reactPlugin}>
        <QueryClientProvider client={queryClient}>
          <ReduxProvider store={store}>
            <MediaContextProvider disableDynamicMediaQueries>
              <SSRProvider>
                <Outlet />
              </SSRProvider>
            </MediaContextProvider>
          </ReduxProvider>
        </QueryClientProvider>
      </AppInsightsContext.Provider>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <style
          id="fresnel-media"
          dangerouslySetInnerHTML={{ __html: mediaStyles }}
        />
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
