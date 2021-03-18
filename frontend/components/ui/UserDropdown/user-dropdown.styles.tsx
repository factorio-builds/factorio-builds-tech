import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"
import Stacker from "../Stacker"

export const MenuTrigger = styled.button`
  ${getTypo(ETypo.BUTTON)};
  display: flex;
  align-items: center;
  background: linear-gradient(180deg, #333742, #272b33);
  color: ${COLOR.FADEDBLUE900};
  height: 38px;
  padding: 0 11px 0 9px;
  border-radius: 5px;
  border: 1px solid ${COLOR.FADEDBLUE500};
  border: none;
  cursor: pointer;

  &:hover {
    background: linear-gradient(180deg, #2f323a, #23262b);
  }

  svg path {
    fill: ${COLOR.FADEDBLUE500};
  }
`

export const InnerMenuTrigger = styled(Stacker)`
  display: flex;
  align-items: center;
`

export const StyledMenuButton = styled.div`
  position: relative;
  display: inline-block;
`

export const StyledMenuPopup = styled.ul`
  box-sizing: border-box;
  list-style: none;
  min-width: 100%;
  position: absolute;
  right: 0;
  border-radius: 5px;
  margin: 4px 0 0 0;
  border: 1px solid ${COLOR.FADEDBLUE500};
  border: 1px solid #454854;
  padding: 6px 0;
  background: ${COLOR.HEADER};
  overflow: hidden;
`

export const StyledMenuItem = styled.li`
  color: ${COLOR.FADEDBLUE900};
  padding: 6px 9px;
  outline: none;
  cursor: pointer;
  text-align: right;

  &:hover,
  &.is-focused {
    background: ${COLOR.FADEDBLUE300};
    background: linear-gradient(180deg, #333742, #272b33);
  }
`

export const InnerLink = styled.div`
  display: inline-block;
  cursor: pointer;
  color: ${COLOR.FADEDBLUE900};
  text-decoration: none;
`

export const InnerLinkLogOff = styled(InnerLink)`
  color: ${COLOR.DANGER};
`
