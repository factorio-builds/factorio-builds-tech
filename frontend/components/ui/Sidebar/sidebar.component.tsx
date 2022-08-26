import React from "react"
import { HEADER_HEIGHT } from "../../../design/tokens/layout"
import { useAppSelector } from "../../../redux/store"
import * as S from "./sidebar.styles"

interface ISidebarProps {
  children: React.ReactNode
}

function Sidebar(props: ISidebarProps): JSX.Element {
  const headerHeight = useAppSelector((state) =>
    state.layout.header.init ? state.layout.header.height : HEADER_HEIGHT
  )

  return (
    <S.SidebarWrapper
      role="search"
      style={{ "--headerHeight": `${headerHeight}px` } as React.CSSProperties}
    >
      <S.SidebarContent>{props.children}</S.SidebarContent>
      <S.SidebarBG />
    </S.SidebarWrapper>
  )
}

export default Sidebar
