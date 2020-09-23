import styled from "styled-components"

export const BuildCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: #555;
  height: 200px;
`

export const Content = styled.div`
  padding: 32px 16px 16px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
  color: #fff;
`

export const Title = styled.h3`
  font-weight: 400;
  font-size: 18px;
  margin: 0 0 8px;

  a {
    color: #fff;
  }
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
