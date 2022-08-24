import React, { ReactNode, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import "intersection-observer"
import Head from "next/head"
import { HEADER_HEIGHT } from "../../../design/tokens/layout"
import { useAppDispatch } from "../../../redux/store"
import Header from "../Header"

interface ILayoutProps {
  title?: string
  children?: ReactNode
}

const Layout: React.FC<ILayoutProps> = ({ children, title }) => {
  const dispatch = useAppDispatch()
  const { ref, entry } = useInView({
    threshold: Array.from({ length: HEADER_HEIGHT }).map((_, i) => {
      return i / HEADER_HEIGHT
    }),
  })

  useEffect(() => {
    if (entry) {
      dispatch({
        type: "SET_HEADER",
        payload: entry.intersectionRect.height,
      })
    }
  }, [entry])

  return (
    <>
      <Head>
        <title>{["Factorio Builds", title].filter(Boolean).join(" | ")}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header ref={ref} />
      {children}
    </>
  )
}

export default Layout
