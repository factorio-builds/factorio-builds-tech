import React from "react"
import * as SC from "./sidebar.styles"

interface ISidebarProps {
  children: React.ReactNode
}

function Sidebar(props: ISidebarProps): JSX.Element {
  return (
    <SC.SidebarWrapper>
      <SC.SidebarContent>{props.children}</SC.SidebarContent>
      <SC.SidebarBG />
    </SC.SidebarWrapper>
  )
}

export default Sidebar
