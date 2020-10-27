import { transparentize } from "polished"
import styled from "styled-components"

export const BuildCardWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: #555;
  cursor: pointer;
`

export const BackgroundImage = styled.img`
  display: block;
  width: 100%;
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
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 18px;
  min-height: 28px;
  margin: 0 0 8px;

  a {
    color: #fff;
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
  background: #fff;
  color: #222;
  border-radius: 16px;
  padding: 4px 8px;
  font-size: 13px;
  text-transform: lowercase;
`
