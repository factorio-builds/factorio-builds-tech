import React from "react"
import { HEADER_HEIGHT } from "../../../design/tokens/layout"
import { useAppSelector } from "../../../redux/store"
import * as SC from "./sidebar.styles"

interface ISidebarProps {
  children: React.ReactNode
}

function Sidebar(props: ISidebarProps): JSX.Element {
  const headerHeight = useAppSelector((state) =>
    state.layout.header.init ? state.layout.header.height : HEADER_HEIGHT
  )

  return (
    <SC.SidebarWrapper
      role="search"
      style={{ "--headerHeight": `${headerHeight}px` } as React.CSSProperties}
    >
      <SC.SidebarContent>{props.children}</SC.SidebarContent>
      <SC.SidebarBG />
    </SC.SidebarWrapper>
  )
}

export default Sidebar
