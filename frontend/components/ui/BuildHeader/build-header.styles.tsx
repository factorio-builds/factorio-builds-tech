import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"

export const BuildHeaderWrapper = styled.header`
  margin-bottom: 16px;
  padding: 10px;
  border-radius: 7px;
  color: ${COLOR.FADEDBLUE700};
  background: ${COLOR.SUBHEADER};
`

export const BuildTitle = styled.h2`
  ${getTypo(ETypo.PAGE_HEADER)};
  color: ${COLOR.FADEDBLUE900};
  margin: 0;
`

export const StyledLink = styled.a`
  font-weight: 700;
  color: ${COLOR.FADEDBLUE900};
  text-decoration: none;

  &:hover {
    color: #fff;
    border-bottom: 2px solid #fff;
  }
`

export const BuildTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -8px !important;
`

export const BuildHeaderMeta = styled.div`
  font-weight: 700;
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin: 4px 8px;

  img {
    width: 20px;
    margin-right: 8px;
  }
`
