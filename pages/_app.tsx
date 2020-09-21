import { Provider } from "react-redux"
import type { AppProps } from "next/app"
import { ThemeProvider } from "styled-components"
import { useStore } from "../redux/store"
import { GlobalStyle } from "../styles/global-style"
import { theme } from "../styles/theme"

function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState)

  return (
    <Provider store={store}>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
