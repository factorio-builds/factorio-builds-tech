import { lighten } from "polished"
import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"
import Button from "../../ui/Button"
import Stacker from "../../ui/Stacker"

export const Content = styled.div``

export const ButtonsStack = styled(Stacker)`
  margin-top: 16px;
`

export const TextButton = styled.button`
  ${getTypo(ETypo.BUTTON)};
  background: none;
  border: none;
  padding: 0;
  color: ${COLOR.FADEDBLUE700};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: ${COLOR.FADEDBLUE900};
  }
`

export const GroupTitle = styled.button`
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  font: inherit;
  color: inherit;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;

  svg {
    margin-right: 12px;
  }
`

export const CoverWrapper = styled.div`
  width: 716px;
`

export const PageButton = styled(Stacker)`
  ${getTypo(ETypo.PAGE_SUBTITLE)};
  font-size: 18px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  background: ${COLOR.CARD};
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  padding: 16px;
  border: 2px solid ${COLOR.CARD};

  &:hover {
    background: ${lighten(0.05, COLOR.CARD)};
    border-color: ${lighten(0.05, COLOR.CARD)};
  }

  &.is-active {
    background: ${lighten(0.05, COLOR.CARD)};
    border-color: ${COLOR.FADEDBLUE500};
    pointer-events: none;
  }
`

export const PageNumber = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 2px solid ${COLOR.FADEDBLUE700};
  border-radius: 5px;
  margin-right: 8px;

  .is-active & {
    background: ${COLOR.FADEDBLUE700};
    color: ${COLOR.BACKGROUND};
  }
`

export const PageBody = styled(Stacker)``

export const PageFeedback = styled(Stacker)`
  color: ${COLOR.DANGER};
  align-items: center;

  svg {
    width: 20px;
  }

  svg path {
    fill: ${COLOR.DANGER};
  }

  &.is-valid {
    color: ${COLOR.SUCCESS};
  }

  &.is-optional {
    color: ${COLOR.FADEDBLUE500};
  }

  &.is-valid svg path {
    fill: ${COLOR.SUCCESS};
  }
`

export const RenderedCovers = styled.div``

export const SelectRenderButton = styled(Button)`
  margin-top: 8px;
  align-self: flex-end;
`

export const Rendered = styled.div`
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);

  img {
    display: block;
    max-height: calc(100vh - 40px);
  }
`
