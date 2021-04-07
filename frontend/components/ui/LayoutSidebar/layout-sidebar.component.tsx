import React, { ReactNode, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLockBodyScroll } from "react-use"
import { Media } from "../../../design/styles/media"
import { IStoreState } from "../../../redux/store"
import Container from "../Container"
import Layout from "../Layout"
import Sidebar from "../Sidebar"
import * as SC from "./layout-sidebar.styles"

interface ILayoutSidebarProps {
  children?: ReactNode
  sidebar: ReactNode
  title?: string
}

const LayoutSidebar: React.FC<ILayoutSidebarProps> = ({
  children,
  sidebar,
  title,
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
    <Layout title={title}>
      <SC.ContentWrapper>
        <Container>
          <Media lessThan="sm">
            {(mcx, renderChildren) => {
              return (
                <SC.BodyWrapper
                  className={mcx}
                  orientation="vertical"
                  gutter={0}
                >
                  {renderChildren ? (
                    <>
                      {sidebarActive && (
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
                <SC.BodyWrapper
                  className={mcx}
                  orientation="horizontal"
                  gutter={20}
                >
                  {renderChildren ? (
                    <>
                      <Sidebar>{sidebar}</Sidebar>
                      <SC.Content>{children}</SC.Content>
                    </>
                  ) : null}
                </SC.BodyWrapper>
              ) : null
            }}
          </Media>
        </Container>
      </SC.ContentWrapper>
    </Layout>
  )
}

export default LayoutSidebar
