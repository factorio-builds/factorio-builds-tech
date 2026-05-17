// Replaces the unmaintained `next-applicationinsights` wrapper. Loaded
// client-side only; gated by ENABLE_APPLICATION_INSIGHTS env at the call site.
import { ApplicationInsights } from "@microsoft/applicationinsights-web"

let initialized = false

export function initAppInsights(instrumentationKey?: string): void {
  if (initialized) return
  if (typeof window === "undefined") return
  if (!instrumentationKey) return

  const appInsights = new ApplicationInsights({
    config: {
      instrumentationKey,
      enableAutoRouteTracking: true,
      autoTrackPageVisitTime: true,
    },
  })
  appInsights.loadAppInsights()
  appInsights.trackPageView()
  initialized = true
}
