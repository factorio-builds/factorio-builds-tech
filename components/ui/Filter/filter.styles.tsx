import styled from "styled-components"
import { COLOR } from "../../../design/tokens/color"

export const Square = styled.div`
  box-sizing: border-box;
  background: #fff;
  width: 18px;
  height: 18px;
  border: 2px solid #fff;

  &.is-checked {
    background: ${COLOR.SUCCESS};
  }
`

export const FilterWrapper = styled.div`
  display: flex;
  cursor: pointer;
  margin: 16px 0;

  &:hover ${Square} {
    background: #c7e6ad;
  }
`

export const Text = styled.div`
  margin-left: 16px;
`
