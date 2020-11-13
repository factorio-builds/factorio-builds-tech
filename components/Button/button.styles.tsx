import styled from "styled-components"

export const ButtonWrapper = styled.button`
  padding: 9px 13px;
  color: #fff;
  font-size: 17px;
  font-weight: 400;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &[disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  &:focus {
    box-shadow: 0 0 0 3px #aad1ff;
    outline: none;
  }

  &.variant-success {
    background: linear-gradient(#50b954, #3b7a3d);
  }

  &.variant-success:hover {
    background: linear-gradient(#47b34c, #2b592d);
  }
`
