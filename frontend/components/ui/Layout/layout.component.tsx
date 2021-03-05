import React, { ReactNode, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLockBodyScroll } from "react-use"
import Head from "next/head"
import { Media } from "../../../design/styles/media"
import { IStoreState } from "../../../redux/store"
import Container from "../Container"
import Header from "../Header"
import Sidebar from "../Sidebar"
import * as SC from "./layout.styles"

interface ILayoutProps {
  children?: ReactNode
  sidebar?: ReactNode
  title?: string
  subheader?: ReactNode
  size?: "small" | "medium" | "large"
}

const Layout: React.FC<ILayoutProps> = ({
  children,
  sidebar,
  title,
  subheader,
  size = "large",
}) => {
  const dispatch = useDispatch()
  const sidebarActive = useSelector(
    (state: IStoreState) => state.layout.sidebar
  )
  const closeSidebar = useCallback(() => {
    dispatch({
      type: "SET_SIDEBAR",
      payload: false,
    })
  }, [])

  useLockBodyScroll(sidebarActive)

  return (
    <>
      <Head>
        <title>{["Factorio Builds", title].filter(Boolean).join(" | ")}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      {subheader}
      <Container size={size}>
        <Media lessThan="sm">
          <SC.BodyWrapper orientation="vertical" gutter={0}>
            {sidebarActive && sidebar && (
              <>
                <SC.Backdrop onClick={closeSidebar} />
                <Sidebar>{sidebar}</Sidebar>
              </>
            )}
            <SC.Content>{children}</SC.Content>
          </SC.BodyWrapper>
        </Media>
        <Media greaterThanOrEqual="sm">
          <SC.BodyWrapper orientation="horizontal" gutter={20}>
            {sidebar && <Sidebar>{sidebar}</Sidebar>}
            <SC.Content>{children}</SC.Content>
          </SC.BodyWrapper>
        </Media>
      </Container>
    </>
  )
}

export default Layout
