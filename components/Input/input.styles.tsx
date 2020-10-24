import styled, { css } from "styled-components"
import { COLOR } from "../../design/tokens/color"

const BaseInput = css`
  padding: 5px 14px;
  border: 2px solid ${COLOR.GREY300};
  font-size: 18px;
  line-height: 24px;
  line-height: 1.8;
  font-weight: 400;
  outline: 3px solid #fff;

  &:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  }

  &::placeholder {
    color: #b1b1b1;
  }

  .is-error & {
    border-color: ${COLOR.DANGER} !important;
  }

  &:focus {
    box-shadow: 0 0 0 3px #aad1ff;
    outline: none;
  }
`

export const StyledInput = styled.input`
  ${BaseInput};
`

export const StyledTextarea = styled.textarea`
  ${BaseInput};
  resize: vertical;
  min-height: 200px;
`
