import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"

export const StyledInputWrapper = styled.div`
  display: flex;
  flex-direction: column;

  &.size-small {
    max-width: 250px;
  }
`

export const Label = styled.label`
  ${getTypo(ETypo.FORM_LABEL)};
  color: ${COLOR.PURPLE900};
  margin-bottom: 6px;
`

export const ValidMessage = styled.div`
  ${getTypo(ETypo.FORM_INPUT)};
  display: flex;
  align-items: center;
  color: #68c06b;
  margin-top: 8px;

  & svg {
    width: 16px;
    margin-right: 8px;
  }

  & svg path {
    fill: #68c06b;
  }
`
