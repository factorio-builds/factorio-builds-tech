import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import cx from "classnames"
import { useDebouncedEffect } from "../../hooks/useDebouncedEffect"
import { IStoreState } from "../../redux/store"
import * as SC from "./search-input.styles"

const SearchInput = (): JSX.Element => {
  const dispatch = useDispatch()
  const query = useSelector((state: IStoreState) => state.filters.query)
  const [input, setInput] = useState(query)
  const [focused, setFocused] = useState(false)

  useDebouncedEffect(
    () => {
      dispatch({ type: "SET_QUERY", payload: input })
    },
    250,
    [input]
  )

  function setFocus(): void {
    setFocused(true)
  }

  function clearFocus(): void {
    setFocused(false)
  }

  // TODO: type properly
  // @ts-ignore
  function handleOnChange(event: KeyboardEvent<HTMLInputElement>): void {
    setInput(event.target.value)
  }

  return (
    <SC.SearchInputWrapper className={cx({ "is-focused": focused })}>
      <SC.StyledSearchIcon />
      <SC.SearchInput
        value={input}
        onChange={handleOnChange}
        placeholder="Search"
        onFocus={setFocus}
        onBlur={clearFocus}
      />
    </SC.SearchInputWrapper>
  )
}

export default SearchInput
