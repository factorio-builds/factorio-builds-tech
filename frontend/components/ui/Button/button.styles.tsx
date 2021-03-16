import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { ETypo } from "../../../design/tokens/typo"

export const ButtonWrapper = styled.button`
  ${getTypo(ETypo.BUTTON)};
  text-decoration: none;
  display: flex;
  padding: 0;
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

  &.variant-cta {
    background: linear-gradient(#6b5bcd, #4e87cb);
  }

  &.variant-cta:hover {
    background: linear-gradient(#5544c5, #3978c6);
  }

  &.variant-default {
    background: #4c5164;
  }

  &.variant-default:hover {
    background: #393c47;
  }

  &.size-small {
    font-size: 13px;
    line-height: 22px;
    border-radius: 3px;
  }
`

export const ButtonInner = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  ${ButtonWrapper}.size-medium & {
    padding: 9px 13px;
  }

  ${ButtonWrapper}.size-small & {
    padding: 2px 9px;
  }
`

export const Counter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px solid #323540;
  margin-left: auto;

  ${ButtonWrapper}.size-medium & {
    padding: 9px 13px;
  }

  ${ButtonWrapper}.size-small & {
    padding: 2px 9px;
  }

  ${ButtonWrapper}:hover & {
    border-color: #151619;
  }
`
