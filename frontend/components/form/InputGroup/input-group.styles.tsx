import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"

export const StyledInputGroup = styled.div`
  display: flex;
  flex-direction: column;
`

export const Legend = styled.div`
  ${getTypo(ETypo.FORM_LABEL)};
  color: ${COLOR.FADEDBLUE900};

  span {
    font-weight: 400;
  }
`
