import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { ETypo } from "../../../design/tokens/typo"

export const FavoriteButtonWrapper = styled.button`
  ${getTypo(ETypo.BUTTON)};

  &.is-error {
    border: 1px solid red;
  }
`
