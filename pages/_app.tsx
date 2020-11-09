import type { AppContext, AppProps } from "next/app"
import { ThemeProvider } from "styled-components"
import { User } from "../db/entities/user.entity"
import { wrapper } from "../redux/store"
import { GlobalStyle } from "../styles/global-style"
import { theme } from "../styles/theme"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

MyApp.getInitialProps = async ({ Component, ctx }: AppContext) => {
  // @ts-ignore
  const user: User = ctx.req?.session?.passport?.user

  if (user) {
    ctx.store.dispatch({
      type: "SET_USER",
      payload: user,
    })
  }

  return {
    pageProps: {
      ...(Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}),
    },
  }
}

export default wrapper.withRedux(MyApp)
