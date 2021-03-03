import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useDebouncedEffect } from "../../../hooks/useDebouncedEffect"
import { searchBuildsAsync } from "../../../redux/reducers/search"
import { IStoreState } from "../../../redux/store"
import Input from "../../form/Input"
import * as SC from "./search.styles"

const Search = (): JSX.Element => {
  const dispatch = useDispatch()
  const query = useSelector((state: IStoreState) => state.filters.query)
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
      icon={<SC.StyledSearchIcon />}
      onChange={handleOnChange}
    />
  )
}

export default Search
