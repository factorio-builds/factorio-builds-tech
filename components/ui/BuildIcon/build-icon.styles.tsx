import styled from "styled-components"

export const BuildIconWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #235581, #133756);
  border: 2px dashed #7fbace;
  margin-right: 8px;

  img {
    margin: 0;
    margin: 5%;
  }

  &.is-large img {
    width: 80%;
    height: 80%;
  }

  &.is-medium img {
    width: 40%;
    height: 40%;
  }
`
