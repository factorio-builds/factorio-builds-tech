import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo, FONT_FAMILY } from "../../../design/tokens/typo"

export const SubHeader = styled.div`
  background: #333642;
  padding: 20px 0;
  font-family: ${FONT_FAMILY.MONO};
  font-size: 16px;
  letter-spacing: -0.025em;
  margin-bottom: 10px;
`

export const SubHeaderLink = styled.a`
  text-decoration: underline;
  color: ${COLOR.FADEDBLUE900};

  &:hover {
    color: ${COLOR.FADEDBLUE700};
  }
`

export const BuildHeaderWrapper = styled.header`
  margin-bottom: 16px;
  padding: 10px 0;
  border-radius: 7px;
  color: ${COLOR.FADEDBLUE700};
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
  font-weight: 500;
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin: 4px;
  background: #1c1c1c;
  padding: 4px 6px;
  border: 1px solid #4d4d4d;
  border-radius: 4px;
  font-size: 14px;

  img {
    width: 20px;
    margin-right: 8px;
  }
`

export const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -4px;

  > * {
    box-sizing: border-box;
    margin: 4px !important;
  }

  @media screen and (max-width: 767px) {
    > * {
      width: calc(50% - 8px);
    }
  }
`
