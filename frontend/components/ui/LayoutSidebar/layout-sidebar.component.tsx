import React, { ReactNode, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLockBodyScroll } from "react-use"
import { DesktopOnly, MobileOnly } from "../../../design/helpers/media"
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
          <MobileOnly>
            <SC.BodyWrapper orientation="vertical" gutter={0}>
              {sidebarActive && (
                <>
                  <SC.Backdrop onClick={closeSidebar} />
                  <Sidebar>{sidebar}</Sidebar>
                </>
              )}
              <SC.Content>{children}</SC.Content>
            </SC.BodyWrapper>
          </MobileOnly>

          <DesktopOnly>
            <SC.BodyWrapper orientation="horizontal" gutter={20}>
              <Sidebar>{sidebar}</Sidebar>
              <SC.Content>{children}</SC.Content>
            </SC.BodyWrapper>
          </DesktopOnly>
        </Container>
      </SC.ContentWrapper>
    </Layout>
  )
}

export default LayoutSidebar
