import { lighten } from "polished"
import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"
import Stacker from "../Stacker"

export const BlueprintItemWrapper = styled.div<{ depth: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  cursor: pointer;
  overflow: hidden;
  margin-left: ${(props) => props.depth * 40}px;
`

export const BlueprintItemInner = styled.div``

export const ImageWrapper = styled.div`
  width: 200px;
`

export const Content = styled.div`
  padding: 16px;
  color: ${COLOR.FADEDBLUE900};
  margin: 4px 0;
  background: ${COLOR.CARD};
  border-radius: 5px;

  ${BlueprintItemInner}:hover & {
    background: ${lighten(0.05, COLOR.CARD)};
    color: #fff;
  }
`

export const Info = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
  color: ${COLOR.FADEDBLUE900};
`

export const Title = styled(Stacker)`
  ${getTypo(ETypo.CARD_TITLE)};
  line-height: 1.1;
  display: flex;
  align-items: center;
  min-height: 28px;

  a {
    color: #fff;
  }
`

export const Meta = styled.small`
  color: ${COLOR.FADEDBLUE500};
  font-weight: 400;
`

export const Expand = styled.button`
  margin: 0;
  border: 0;
  padding: 0;
  background: transparent;
  color: ${COLOR.LINK};
  margin-left: auto !important;
  cursor: pointer;
`

export const Category = styled.div`
  ${getTypo(ETypo.METADATA)};
  color: #a392b5;
  text-transform: lowercase;

  ${BlueprintItemWrapper}:hover & {
    color: ${lighten(0.05, "#a392b5")};
  }
`

export const Expanded = styled.div``

export const Description = styled.p`
  margin: 0;
  font-size: 15px;

  & + & {
    margin: 16px 0 0 0;
  }
`
