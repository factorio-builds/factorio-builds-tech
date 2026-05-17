import { ApplicationInsights } from "@microsoft/applicationinsights-web"
import { ReactPlugin } from "@microsoft/applicationinsights-react-js"

export const reactPlugin = new ReactPlugin()

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
      extensions: [reactPlugin],
    },
  })
  appInsights.loadAppInsights()
  appInsights.trackPageView()
  initialized = true
}
