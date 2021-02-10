import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { ETypo } from "../../../design/tokens/typo"

export const AvatarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  background: linear-gradient(153.43deg, #37d291 0%, #225594 106.06%);
  ${getTypo(ETypo.BODY)}

  &.size-medium {
    width: 22px;
    height: 22px;
    font-size: 13px;
    border-radius: 5px;
  }

  &.size-large {
    width: 28px;
    height: 28px;
    font-size: 15px;
    border-radius: 5px;
    font-weight: 700;
  }
`
