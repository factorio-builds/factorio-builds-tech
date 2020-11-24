import styled, { css } from "styled-components"
import { COLOR } from "../../../design/tokens/color"

const BaseInput = css`
  padding: 5px 14px;
  background: ${COLOR.INPUT};
  border: 2px solid ${COLOR.PURPLE500};
  color: ${COLOR.PURPLE700};
  font-size: 18px;
  line-height: 24px;
  line-height: 1.8;
  font-weight: 400;

  &:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  }

  .is-error & {
    border-color: ${COLOR.DANGER} !important;
  }

  &:focus {
    box-shadow: 0 0 0 3px #aad1ff;
    outline: none;
  }
`

export const StyledInputWrapper = styled.div`
  ${BaseInput};
  display: flex;
  align-items: center;
`

export const StyledInput = styled.input`
  border: 0;
  background: transparent;
  color: ${COLOR.PURPLE700};
  flex: 1 0 auto;
  font-size: 18px;
  line-height: 24px;
  line-height: 1.8;

  &:focus {
    outline: 0;
  }

  &::placeholder {
    color: ${COLOR.PURPLE500};
  }
`

export const StyledTextarea = styled.textarea`
  ${BaseInput};
  resize: vertical;
  min-height: 200px;

  &::placeholder {
    color: ${COLOR.PURPLE500};
  }
`
