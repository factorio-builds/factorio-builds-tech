import styled from "styled-components"
import { COLOR } from "../../../design/tokens/color"
import { HEADER_HEIGHT } from "../../../design/tokens/layout"

export const SidebarWrapper = styled.aside`
  width: 300px;
  flex: 0 0 300px;
  padding: 20px 20px 20px 0;
  position: relative;
  background: ${COLOR.SIDEBAR};
  border-right: 1px solid ${COLOR.FADEDBLUE300};
  height: calc(100vh - var(--headerHeight) - 40px);
  position: sticky;
  top: 0;
  bottom: 0;
  overflow-y: scroll;

  @media screen and (max-width: 767px) {
    position: absolute;
    top: ${HEADER_HEIGHT}px;
    left: 0;
    max-width: 400px;
    right: 40px;
    padding: 20px;
    width: auto;
    z-index: 5;
    height: calc(100vh - ${HEADER_HEIGHT}px - 40px);
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
