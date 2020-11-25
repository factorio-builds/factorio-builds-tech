import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { ETypo } from "../../../design/tokens/typo"

export const FilterListWrapper = styled.div``

export const Title = styled.div`
  ${getTypo(ETypo.FORM_LABEL)};
  margin-bottom: 16px;
`

export const Separator = styled.div`
  margin: 16px 0;
  width: 100%;
  height: 1px;
  background: #402e5b;
`
