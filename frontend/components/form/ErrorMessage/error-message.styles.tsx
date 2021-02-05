import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"

export const ErrorMessageWrapper = styled.div`
  ${getTypo(ETypo.FORM_INPUT)};
  display: flex;
  align-items: center;
  color: ${COLOR.DANGER};
  margin-top: 4px;
`
