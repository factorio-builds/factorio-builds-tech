import { withApplicationInsights } from "next-applicationinsights"
import { ITelemetryItem, } from "@microsoft/applicationinsights-web"
import { BaseTelemetryPlugin, Tags, IProcessTelemetryContext, IConfiguration, IAppInsightsCore, IPlugin, ITelemetryPluginChain } from "@microsoft/applicationinsights-core-js"
import { ContextTagKeys, IConfig } from "@microsoft/applicationinsights-common"
import type { AppContext, AppProps } from "next/app"
import getConfig from "next/config"
import Head from "next/head"
import { compose } from "redux"
import { ThemeProvider } from "styled-components"
import { GlobalStyle } from "../design/styles/global-style"
import { theme } from "../design/styles/theme"
import { wrapper } from "../redux/store"
import auth from "../utils/auth"

const { publicRuntimeConfig } = getConfig()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1a161d" />
        <meta name="msapplication-TileColor" content="#1a161d" />
        <meta name="theme-color" content="#1a161d" />
      </Head>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

MyApp.getInitialProps = async ({ Component, ctx }: AppContext) => {
  // ReferenceError: window is not defined
  // console.log(window.appInsights)

  if (typeof window === "undefined") {
    const session = await auth.getSession(ctx.req!)

    if (session?.user) {
      ctx.store.dispatch({
        type: "SET_USER",
        payload: {
          id: session.user.sub,
          username: session.user.username,
          accessToken: session.accessToken,
        },
      })
    }
  } else {
    // see https://github.com/microsoft/ApplicationInsights-JS#telemetry-initializers
    // const tagKeys = new ContextTagKeys()
    // const telemetryInitializer = (envelope) => {
    //   console.log('telemetryInitializer envelope', envelope)

    //   envelope.tags[tagKeys.cloudRole] = publicRuntimeConfig.cloudRoleName
    //   envelope.tags[tagKeys.cloudRoleInstance] = publicRuntimeConfig.cloudRoleInstance
    //   envelope.tags[tagKeys.userAuthUserId] =  "dan" // get from session
    //   envelope.tags[tagKeys.applicationVersion] = "1.2.3" // get from build information
    // }

    // window.appInsights.addTelemetryInitializer(telemetryInitializer);
  }

  return {
    pageProps: {
      ...(Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}),
    },
  }
}


class CloudRolePlugin extends BaseTelemetryPlugin {
  identifier = "CloudRolePlugin"
  priority = 1
  tagKeys = new ContextTagKeys()

  constructor() {
    super()
  }

  initialize(config: IConfiguration & IConfig, core: IAppInsightsCore, extensions: IPlugin[], pluginChain?: ITelemetryPluginChain) {
    super.initialize(config, core, extensions, pluginChain)

    console.log('CloudRolePlugin.initialize config', config)
    console.log('CloudRolePlugin.initialize core', core)
    console.log('CloudRolePlugin.initialize extensions', extensions)
    console.log('CloudRolePlugin.initialize pluginChain', pluginChain)
  }

  processTelemetry(event: ITelemetryItem, itemCtx?: IProcessTelemetryContext) {
    console.log('CloudRolePlugin.processTelemetry event.tags', event.tags)
    console.log('CloudRolePlugin.processTelemetry itemCtx', itemCtx)

    if (!event.tags) {
      event.tags = [] as Tags & Tags[]
    }

    event.tags[this.tagKeys.cloudRole] = publicRuntimeConfig.cloudRoleName
    event.tags[this.tagKeys.cloudRoleInstance] = publicRuntimeConfig.cloudRoleInstance
    event.tags[this.tagKeys.userAuthUserId] = "dan" // get from session
    event.tags[this.tagKeys.applicationVersion] = "1.2.3" // get from build information
  }
}

class AnotherPlugin extends BaseTelemetryPlugin {
  identifier = "AnotherPlugin"
  priority = 500

  constructor() {
    super()
  }

  initialize(config: IConfiguration & IConfig, core: IAppInsightsCore, extensions: IPlugin[], pluginChain?: ITelemetryPluginChain) {
    super.initialize(config, core, extensions, pluginChain)

    console.log('AnotherPlugin.initialize config', config)
    console.log('AnotherPlugin.initialize core', core)
    console.log('AnotherPlugin.initialize extensions', extensions)
    console.log('AnotherPlugin.initialize pluginChain', pluginChain)
  }

  processTelemetry(event: ITelemetryItem, itemCtx?: IProcessTelemetryContext) {
    console.log('AnotherPlugin.processTelemetry event.tags', event.tags)
    console.log('AnotherPlugin.processTelemetry itemCtx', itemCtx)
  }
}

export default compose(
  withApplicationInsights({
    instrumentationKey: publicRuntimeConfig.instrumentationKey,
    isEnabled: publicRuntimeConfig.enableApplicationInsights === "true",
    // if this key is set, AI stops sending events.
    // AnotherPlugin is never called, so I suspect the problem is that the custom
    // plugins break the plugin chain. no idea why.
    extensions: [ new CloudRolePlugin(), new AnotherPlugin() ],
  }),
  wrapper.withRedux
)(MyApp)
