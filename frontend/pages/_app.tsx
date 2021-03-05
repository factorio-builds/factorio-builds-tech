import { useEffect } from "react"
import { useSelector } from "react-redux"
import { withApplicationInsights } from "next-applicationinsights"
import type { AppContext, AppProps } from "next/app"
import getConfig from "next/config"
import Head from "next/head"
import qs from "qs"
import { compose } from "redux"
import { ThemeProvider } from "styled-components"
import { GlobalStyle } from "../design/styles/global-style"
import { MediaContextProvider } from "../design/styles/media"
import { theme } from "../design/styles/theme"
import { IStoreState, wrapper } from "../redux/store"
import auth from "../utils/auth"
import { axios } from "../utils/axios"

const { publicRuntimeConfig } = getConfig()

function MyApp({ Component, pageProps }: AppProps) {
  const user = useSelector((store: IStoreState) => store.auth.user)

  useEffect(() => {
    axios.defaults.paramsSerializer = (params) =>
      qs.stringify(params, { arrayFormat: "repeat" })
    axios.defaults.headers.common["Authorization"] = user?.accessToken
      ? `Bearer ${user.accessToken}`
      : ""
  }, [user])

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
        <MediaContextProvider>
          <Component {...pageProps} />
        </MediaContextProvider>
      </ThemeProvider>
    </>
  )
}

MyApp.getInitialProps = async ({ Component, ctx }: AppContext) => {
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
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${session.accessToken}`
    }
  }

  return {
    pageProps: {
      ...(Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}),
    },
  }
}

export default compose(
  withApplicationInsights({
    instrumentationKey: publicRuntimeConfig.instrumentationKey,
    isEnabled: publicRuntimeConfig.enableApplicationInsights === "true",
  }),
  wrapper.withRedux
)(MyApp)
