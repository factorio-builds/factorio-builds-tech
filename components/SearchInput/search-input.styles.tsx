import styled from "styled-components"
import SearchIcon from "../../icons/search-icon"

export const SearchInputWrapper = styled.div`
  display: flex;
  background: #fff;
  color: #424242;
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
  fill: #424242;
  width: 14px;
  flex: 0 0 14px;
  height: auto;
`

export const SearchInput = styled.input`
  margin-left: 14px;
  border: 0;
  background: transparent;
  color: #424242;
  flex: 1 0 auto;

  &:focus {
    outline: 0;
  }

  &::placeholder {
    text-transform: uppercase;
  }
`
