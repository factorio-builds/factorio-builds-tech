import styled from "styled-components"
import { COLOR } from "../../../design/tokens/color"

export const StyledInputWrapper = styled.div`
  display: flex;
  flex-direction: column;

  &.size-small {
    max-width: 250px;
  }
`

export const Label = styled.label`
  color: ${COLOR.PURPLE900};
  font-size: 18px;
  line-height: 1.8;
  font-weight: 700;
`

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  color: ${COLOR.DANGER};
  font-size: 18px;
  font-weight: 400;
  line-height: 1.4;
  margin-top: 4px;
`

export const ValidMessage = styled.div`
  display: flex;
  align-items: center;
  color: #68c06b;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.4;
  margin-top: 8px;

  & svg {
    width: 16px;
    margin-right: 8px;
  }

  & svg path {
    fill: #68c06b;
  }
`
