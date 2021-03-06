import styled from "styled-components"
import { COLOR } from "../../../design/tokens/color"

export const SidebarWrapper = styled.aside`
  width: 300px;
  flex: 0 0 300px;
  padding: 20px 20px 20px 0;
  position: relative;
  background: ${COLOR.SIDEBAR};
  border-right: 1px solid ${COLOR.FADEDBLUE300};

  @media screen and (max-width: 767px) {
    position: absolute;
    top: 74px;
    left: 0;
    max-width: 400px;
    right: 40px;
    padding: 20px;
    width: auto;
    z-index: 5;
    height: calc(100vh - 74px - 40px);
    overflow-y: scroll;
  }
`

export const SidebarContent = styled.div`
  position: relative;
  z-index: 1;
`

export const SidebarBG = styled.div`
  position: absolute;
  background: ${COLOR.SIDEBAR};
  top: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
`
