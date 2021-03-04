import styled, { css } from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"

const BaseInput = css`
  padding: 5px 14px;
  background: ${COLOR.INPUT};
  border: 2px solid ${COLOR.FADEDBLUE500};
  color: ${COLOR.FADEDBLUE700};

  &:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  }

  .is-error & {
    border-color: ${COLOR.DANGER} !important;
  }

  &:focus,
  &:focus-within {
    box-shadow: 0 0 0 3px #aad1ff;
    outline: none;
  }
`

export const StyledInputWrapper = styled.div`
  ${BaseInput};
  display: flex;
  align-items: center;
  border-radius: 6px;
`

export const StyledInput = styled.input`
  ${getTypo(ETypo.FORM_INPUT)};
  line-height: 1.8;
  border: 0;
  background: transparent;
  color: ${COLOR.FADEDBLUE700};
  flex: 1 0 auto;

  &:focus {
    outline: 0;
  }

  &::placeholder {
    color: ${COLOR.FADEDBLUE500};
  }

  // fix for chrome autocomplete
  &:-webkit-autofill,
  &:-internal-autofill-selected {
    box-shadow: 0 0 0 50px ${COLOR.INPUT} inset;
    -webkit-text-fill-color: ${COLOR.FADEDBLUE700};
  }
`

export const StyledTextarea = styled.textarea`
  ${getTypo(ETypo.FORM_INPUT)};
  ${BaseInput};
  padding: 11px 14px;
  resize: vertical;
  min-height: 200px;
  border-radius: 6px;

  &::placeholder {
    color: ${COLOR.FADEDBLUE500};
  }
`

export const Prefix = styled.div`
  pointer-events: none;
  color: ${COLOR.FADEDBLUE500};
  padding-right: 4px;
`
