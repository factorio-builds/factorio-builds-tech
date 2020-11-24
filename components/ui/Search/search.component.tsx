import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useDebouncedEffect } from "../../../hooks/useDebouncedEffect"
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
    },
    250,
    [input]
  )

  // TODO: type properly
  // @ts-ignore
  function handleOnChange(event: KeyboardEvent<HTMLInputElement>): void {
    setInput(event.target.value)
  }

  return (
    <Input.Text
      id="filter-search"
      value={input}
      placeholder="Search"
      icon={<SC.StyledSearchIcon />}
      onChange={handleOnChange}
    />
  )
}

export default Search
