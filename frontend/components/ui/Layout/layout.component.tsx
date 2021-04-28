import React, { ReactNode, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLockBodyScroll } from "react-use"
import cx from "classnames"
import Head from "next/head"
import { Media } from "../../../design/styles/media"
import { IStoreState } from "../../../redux/store"
import Container from "../Container"
import Header from "../Header"
import Links from "../Links"
import Sidebar from "../Sidebar"
import * as SC from "./layout.styles"

interface ILayoutProps {
  children?: ReactNode
  sidebar?: ReactNode
  title?: string
}

const Layout: React.FC<ILayoutProps> = ({ children, sidebar, title }) => {
  const dispatch = useDispatch()
  const sidebarActive = useSelector((state: IStoreState) => state.layout.sidebar)
  const closeSidebar = useCallback(() => {
    dispatch({
      type: "SET_SIDEBAR",
      payload: false,
    })
  }, [])

  useLockBodyScroll(sidebarActive)

  const wrapper = useMemo(() => {
    return (
      <>
        <Media lessThan="sm">
          {(mcx, renderChildren) => {
            return (
              <SC.BodyWrapper className={mcx} orientation="vertical" gutter={0}>
                {renderChildren ? (
                  <>
                    {sidebarActive && sidebar && (
                      <>
                        <SC.Backdrop onClick={closeSidebar} />
                        <Sidebar>{sidebar}</Sidebar>
                      </>
                    )}
                    <SC.Content>{children}</SC.Content>
                  </>
                ) : null}
              </SC.BodyWrapper>
            )
          }}
        </Media>
        <Media greaterThanOrEqual="sm">
          {(mcx, renderChildren) => {
            return renderChildren ? (
              <SC.BodyWrapper className={mcx} orientation="horizontal" gutter={20}>
                {renderChildren ? (
                  <>
                    {sidebar && <Sidebar>{sidebar}</Sidebar>}
                    <SC.Content>{children}</SC.Content>
                  </>
                ) : null}
              </SC.BodyWrapper>
            ) : null
          }}
        </Media>
      </>
    )
  }, [children, sidebar, sidebarActive])

  return (
    <>
      <Head>
        <title>{["Factorio Builds", title].filter(Boolean).join(" | ")}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <SC.ContentWrapper className={cx({ "has-sidebar": Boolean(sidebar) })}>
        {sidebar ? <Container>{wrapper}</Container> : <>{wrapper}</>}
        {!sidebar && (
          <SC.Footer>
            <Container size="medium">
              <Links orientation="horizontal" />
            </Container>
          </SC.Footer>
        )}
      </SC.ContentWrapper>
    </>
  )
}

export default Layout
