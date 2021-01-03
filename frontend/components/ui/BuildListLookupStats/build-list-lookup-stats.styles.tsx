import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"

export const BuildListLookupStatWrapper = styled.div`
  ${getTypo(ETypo.BODY)};
  margin-bottom: 20px;
`

export const LookupTime = styled.div`
  color: ${COLOR.PURPLE500};
`

export const Count = styled.div`
  color: ${COLOR.PURPLE700};
`
