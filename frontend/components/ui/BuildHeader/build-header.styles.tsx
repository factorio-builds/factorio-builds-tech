import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"

export const BuildHeaderWrapper = styled.header`
  margin-bottom: 16px;
  padding-bottom: 16px;
  color: ${COLOR.PURPLE700};
  background: #0a090c;
`

export const BuildTitle = styled.h2`
  ${getTypo(ETypo.PAGE_HEADER)};
  color: ${COLOR.PURPLE900};
  margin: 0;
`

export const StyledLink = styled.a`
  font-weight: 700;
  color: ${COLOR.PURPLE900};
  text-decoration: none;

  &:hover {
    color: #fff;
    border-bottom: 2px solid #fff;
  }
`

export const BuildHeaderMeta = styled.div`
  font-weight: 700;
  display: flex;
  align-items: center;

  img {
    width: 20px;
    margin-right: 8px;
  }
`
