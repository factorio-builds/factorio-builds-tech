import styled from "styled-components"
import { COLOR } from "../../design/tokens/color"
import SearchIcon from "../../icons/search-icon"

export const SearchInputWrapper = styled.div`
  display: flex;
  background: #fff;
  color: ${COLOR.GREY300};
  font-size: 17px;
  padding: 12px 16px;
  cursor: pointer;
  transition: 0.3s background;
  align-items: center;
  margin-bottom: 32px;
  border: 2px solid #fff;

  &.is-focused {
    border-color: #3492ff;
  }
`

export const StyledSearchIcon = styled(SearchIcon)`
  fill: ${COLOR.GREY300};
  width: 14px;
  flex: 0 0 14px;
  height: auto;
`

export const SearchInput = styled.input`
  margin-left: 14px;
  border: 0;
  background: transparent;
  color: ${COLOR.GREY300};
  flex: 1 0 auto;

  &:focus {
    outline: 0;
  }

  &::placeholder {
    text-transform: uppercase;
  }
`
