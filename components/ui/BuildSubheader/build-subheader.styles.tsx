import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { ETypo } from "../../../design/tokens/typo"

export const BuildSubheaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const Title = styled.h1`
  ${getTypo(ETypo.PAGE_HEADER)};
  display: flex;
  align-items: center;
  color: #fff;

  img {
    width: 32px;
    height: auto;
    margin-right: 8px;
  }
`

export const Subtitle = styled.div`
  ${getTypo(ETypo.PAGE_SUBTITLE)};
  color: #a392b5;
`

export const Book = styled.img`
  height: 24px;
  margin-right: 4px;
`

export const Meta = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 20px;
    margin-right: 8px;
  }
`
