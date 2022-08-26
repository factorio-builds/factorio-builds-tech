import React, { ReactNode, useCallback } from "react"
import { useLockBodyScroll } from "react-use"
import { Media } from "../../../design/styles/media"
import { useAppDispatch, useAppSelector } from "../../../redux/store"
import Container from "../Container"
import Layout from "../Layout"
import Sidebar from "../Sidebar"
import * as S from "./layout-sidebar.styles"

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
  const dispatch = useAppDispatch()
  const sidebarActive = useAppSelector((state) => state.layout.sidebar)
  const closeSidebar = useCallback(() => {
    dispatch({
      type: "SET_SIDEBAR",
      payload: false,
    })
  }, [])

  useLockBodyScroll(sidebarActive)

  return (
    <Layout title={title}>
      <S.ContentWrapper>
        <Container>
          <Media lessThan="sm">
            {(mcx, renderChildren) => {
              return (
                <S.BodyWrapper
                  className={mcx}
                  orientation="vertical"
                  gutter={0}
                >
                  {renderChildren ? (
                    <>
                      {sidebarActive && (
                        <>
                          <S.Backdrop onClick={closeSidebar} />
                          <Sidebar>{sidebar}</Sidebar>
                        </>
                      )}
                      <S.Content>{children}</S.Content>
                    </>
                  ) : null}
                </S.BodyWrapper>
              )
            }}
          </Media>
          <Media greaterThanOrEqual="sm">
            {(mcx, renderChildren) => {
              return renderChildren ? (
                <S.BodyWrapper
                  className={mcx}
                  orientation="horizontal"
                  gutter={20}
                >
                  {renderChildren ? (
                    <>
                      <Sidebar>{sidebar}</Sidebar>
                      <S.Content>{children}</S.Content>
                    </>
                  ) : null}
                </S.BodyWrapper>
              ) : null
            }}
          </Media>
        </Container>
      </S.ContentWrapper>
    </Layout>
  )
}

export default LayoutSidebar
