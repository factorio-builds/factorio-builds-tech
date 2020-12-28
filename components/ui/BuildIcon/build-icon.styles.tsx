import styled from "styled-components"

export const BuildIconWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #235581, #133756);
  border: 2px dashed #7fbace;

  img {
    margin: 5% !important;
  }

  &.large-icons img {
    width: 80%;
    height: 80%;
  }

  &.medium-icons img {
    width: 40%;
    height: 40%;
  }

  &.size-medium {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
  }

  &.size-large {
    width: 60px;
    height: 60px;
    flex: 0 0 60px;
  }
`
