import { lighten } from "polished"
import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"
import Stacker from "../Stacker"

export const BuildCardWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  cursor: pointer;
  border-radius: 4px;
  background: ${COLOR.CARD};
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  padding: 10px;

  &:hover {
    background: ${lighten(0.05, COLOR.CARD)};
  }
`

export const ImageWrapper = styled.div`
  width: 100%;
  filter: contrast(0.8);

  img {
    border-radius: 3px;
  }

  ${BuildCardWrapper}:hover & {
    filter: contrast(1);
  }
`

export const Content = styled.div`
  padding: 10px 0 0;
  color: ${COLOR.FADEDBLUE900};

  ${BuildCardWrapper}:hover & {
    color: #fff;
  }
`

export const Title = styled(Stacker)`
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

export const Categories = styled(Stacker)`
  margin-top: 8px;
  flex-wrap: wrap;
  gap: 4px 8px;

  > * {
    margin: 0 !important;
  }
`

export const Category = styled.div`
  ${getTypo(ETypo.METADATA)};
  color: #9ca4c3;
  text-transform: lowercase;

  ${BuildCardWrapper}:hover & {
    color: ${lighten(0.05, "#9CA4C3")};
  }
`
