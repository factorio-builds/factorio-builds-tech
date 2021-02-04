import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"
import Stacker from "../../ui/Stacker"

export const Row = styled.div`
  display: flex;
  gap: 50px;
`

export const Content = styled.div`
  flex: 0 1 calc(100% - 300px);
`

export const Sidebar = styled.div`
  flex: 0 0 300px;
`

export const ButtonsStack = styled(Stacker)`
  margin-top: 16px;
`

export const SkipButton = styled.button`
  ${getTypo(ETypo.BUTTON)};
  background: none;
  border: none;
  padding: 0;
  color: ${COLOR.PURPLE700};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: ${COLOR.PURPLE900};
  }
`

export const CoverWrapper = styled.div`
  width: 300px;
`

export const PageButton = styled(Stacker)`
  ${getTypo(ETypo.PAGE_SUBTITLE)};
  display: flex;
  align-items: center;
  opacity: 0.5;
  cursor: pointer;

  &:hover {
    opacity: 0.75;
  }

  &.is-active {
    opacity: 1;
    pointer-events: none;
  }
`

export const PageNumber = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 2px solid ${COLOR.PURPLE700};
  border-radius: 50%;
  margin-right: 8px;
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

  &.is-valid svg path {
    fill: ${COLOR.SUCCESS};
  }
`
