import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"

export const Square = styled.div`
  position: relative;
  box-sizing: border-box;
  background: ${COLOR.INPUT};
  width: 34px;
  height: 34px;
  border: 2px solid ${COLOR.PURPLE500};

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    background: transparent;
  }
`

export const HiddenCheckbox = styled.input`
  display: none;
`

export const Label = styled.label`
  ${getTypo(ETypo.FORM_LABEL)};
  display: flex;
  align-items: center;
  cursor: pointer;

  &.is-inline {
    font-weight: 400;
  }
`

export const CheckboxWrapper = styled.div`
  display: flex;

  &:hover ${Square} {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  }

  &:hover ${Square}::after {
    background: ${COLOR.PURPLE500};
  }

  &:focus-within ${Square} {
    box-shadow: 0 0 0 3px ${COLOR.FOCUSED};
    outline: none;
  }

  &.is-checked ${Square}::after {
    background: ${COLOR.SELECTED};
  }

  .is-error ${Square} {
    border-color: ${COLOR.DANGER} !important;
  }
`

export const Text = styled.div`
  ${getTypo(ETypo.FORM_LABEL)};
  display: flex;
  align-items: center;
  margin-left: 12px;
`

export const Prefix = styled.div`
  display: flex;
  width: 24px;
  margin-right: 12px;

  & img,
  & svg {
    width: 100%;
  }
`
