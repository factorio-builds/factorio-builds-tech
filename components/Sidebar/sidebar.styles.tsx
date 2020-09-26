import styled from "styled-components"

export const SidebarWrapper = styled.div`
  background: #eee;
  width: 300px;
  flex: 0 0 300px;
  padding: 20px 20px 20px 0;
  position: relative;
`

export const SidebarContent = styled.div`
  position: relative;
  z-index: 1;
`

export const SidebarBG = styled.div`
  position: absolute;
  background: #f2f0f4;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100vh;
`
