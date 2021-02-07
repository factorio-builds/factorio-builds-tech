import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { ETypo } from "../../../design/tokens/typo"
import ItemIcon from "../ItemIcon"
import Stacker from "../Stacker"

export const WithRequiredItem = styled(Stacker)`
  ${getTypo(ETypo.METADATA)};
  font-size: 16px;
  align-items: center;
`

export const IconImg = styled(ItemIcon)`
  width: 20px;
  margin-right: 4px;
`
