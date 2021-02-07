import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"

export const BuildListSortWrapper = styled.div`
  ${getTypo(ETypo.BODY)};
  color: ${COLOR.FADEDBLUE700};
  margin-bottom: 20px;
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
