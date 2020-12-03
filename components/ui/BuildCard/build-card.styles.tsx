import { transparentize } from "polished"
import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { ETypo } from "../../../design/tokens/typo"

export const BuildCardWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: #555;
  cursor: pointer;
`

export const ImageWrapper = styled.div`
  width: 100%;
  filter: contrast(0.8);

  ${BuildCardWrapper}:hover & {
    filter: contrast(1);
  }
`

export const Content = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 64px 16px 16px;
  background: linear-gradient(
    180deg,
    ${transparentize(1, "#150F1F")} 0%,
    #20182e 75%
  );
  color: #fff;
`

export const Title = styled.h3`
  ${getTypo(ETypo.CARD_TITLE)};
  display: flex;
  align-items: center;
  min-height: 28px;
  margin: 0 0 8px;

  a {
    color: #fff;
  }

  ${BuildCardWrapper}:hover & {
    text-decoration: underline;
  }
`

export const Book = styled.img`
  height: 28px;
  margin-right: 4px;
`

export const Categories = styled.div`
  display: flex;
`

export const CategoryPill = styled.div`
  ${getTypo(ETypo.METADATA)};
  background: #fff;
  color: #222;
  border-radius: 16px;
  padding: 4px 8px;
  text-transform: lowercase;
`
