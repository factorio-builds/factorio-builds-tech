import React, { useState } from "react"
import { useDebouncedEffect } from "../../../hooks/useDebouncedEffect"
import { searchBuildsAsync } from "../../../redux/reducers/search"
import { useAppDispatch, useAppSelector } from "../../../redux/store"
import Input from "../../form/Input"
import * as S from "./search.styles"

const Search = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const query = useAppSelector((state) => state.filters.query)
  const [input, setInput] = useState(query)

  useDebouncedEffect(
    () => {
      dispatch({ type: "SET_QUERY", payload: input })
      dispatch(searchBuildsAsync())
    },
    250,
    [input]
  )

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setInput(event.target.value)
  }

  return (
    <Input.Text
      aria-label="Search"
      id="filter-search"
      value={input}
      placeholder="Search"
      icon={<S.StyledSearchIcon />}
      onChange={handleOnChange}
    />
  )
}

export default Search
