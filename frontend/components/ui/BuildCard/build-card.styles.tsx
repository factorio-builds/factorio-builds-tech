import { lighten } from "polished"
import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"

export const BuildCardWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
`

export const ImageWrapper = styled.div`
  width: 100%;
  filter: contrast(0.8);

  ${BuildCardWrapper}:hover & {
    filter: contrast(1);
  }
`

export const Content = styled.div`
  padding: 16px;
  background: #241a34;
  color: ${COLOR.PURPLE900};

  ${BuildCardWrapper}:hover & {
    background: ${lighten(0.05, "#241a34")};
    color: #fff;
  }
`

export const Title = styled.h3`
  ${getTypo(ETypo.CARD_TITLE)};
  line-height: 1.1;
  display: flex;
  align-items: center;
  min-height: 28px;
  margin: 0 0 4px;

  a {
    color: #fff;
  }
`

export const Category = styled.div`
  ${getTypo(ETypo.METADATA)};
  color: #a392b5;
  text-transform: lowercase;

  ${BuildCardWrapper}:hover & {
    color: ${lighten(0.05, "#a392b5")};
  }
`
