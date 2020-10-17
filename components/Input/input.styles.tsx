import styled, { css } from "styled-components"

const BaseInput = css`
  padding: 5px 14px;
  border: 2px solid #424242;
  font-size: 18px;
  line-height: 24px;
  line-height: 1.8;
  font-weight: 400;

  &:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  }

  &::placeholder {
    color: #b1b1b1;
  }

  .is-error & {
    border-color: #f24439 !important;
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
