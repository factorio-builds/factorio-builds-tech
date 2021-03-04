import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"

export const BuildListSortWrapper = styled.div`
  ${getTypo(ETypo.BODY)};
  font-size: 16px;
  display: flex;
  color: ${COLOR.FADEDBLUE700};
  text-align: right;
`

export const Option = styled.div`
  cursor: pointer;

  &:hover {
    color: ${COLOR.FADEDBLUE900};
  }

  &.is-active {
    font-weight: 700;
    text-decoration: underline;
  }
`

export const SortDropdownWapper = styled.div`
  position: relative;
  margin-left: 4px;
`

export const DropdownTrigger = styled.div`
  font-weight: 700;
  cursor: pointer;
`

export const DropdownMenu = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #333642;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
  position: absolute;
  top: 100%;
  left: -8px;
  right: -8px;
  z-index: 1;
  margin-top: 5px;
  border-radius: 4px;
  min-width: fit-content;
`

export const DropdownItem = styled.button`
  background: transparent;
  border: 0;
  color: ${COLOR.FADEDBLUE900};
  white-space: nowrap;
  padding: 4px 10px;
  cursor: pointer;
  text-align: left;
  min-width: fit-content;
  box-sizing: border-box;

  &:hover,
  &.is-selected {
    background: rgba(0, 0, 0, 0.2);
  }
`
