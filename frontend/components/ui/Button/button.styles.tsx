import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { ETypo } from "../../../design/tokens/typo"

export const ButtonWrapper = styled.button`
  ${getTypo(ETypo.BUTTON)};
  display: flex;
  align-items: center;
  padding: 9px 13px;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  img,
  svg {
    margin-right: 8px;
  }

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

  &.variant-alt {
    background: linear-gradient(#2ca0ba, #246b7a);
  }

  &.variant-alt:hover {
    background: linear-gradient(#25879d, #1f5d6a);
  }
`
