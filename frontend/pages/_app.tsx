import { withApplicationInsights } from "next-applicationinsights"
import type { AppContext, AppProps } from "next/app"
import Head from "next/head"
import { compose } from "redux"
import { ThemeProvider } from "styled-components"
import { GlobalStyle } from "../design/styles/global-style"
import { theme } from "../design/styles/theme"
import { wrapper } from "../redux/store"
import auth from "../utils/auth"

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
    instrumentationKey: process.env.INSTRUMENTATION_KEY,
    isEnabled: process.env.NODE_ENV === "production",
  }),
  wrapper.withRedux
)(MyApp)
