import cx from "classnames"
import React, { useState } from "react"
import * as SC from "./search-input.styles"

const SearchInput = (): JSX.Element => {
  const [search, setSearch] = useState("")
  const [focused, setFocused] = useState(false)

  function setFocus(): void {
    setFocused(true)
  }

  function clearFocus(): void {
    setFocused(false)
  }

  // TODO: type properly
  // @ts-ignore
  function handleOnChange(event: KeyboardEvent<HTMLInputElement>): void {
    setSearch(event.target.value)
  }

  return (
    <SC.SearchInputWrapper className={cx({ "is-focused": focused })}>
      <SC.StyledSearchIcon />
      <SC.SearchInput
        value={search}
        onChange={handleOnChange}
        placeholder="Search"
        onFocus={setFocus}
        onBlur={clearFocus}
      />
    </SC.SearchInputWrapper>
  )
}

export default SearchInput
