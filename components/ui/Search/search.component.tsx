import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useDebouncedEffect } from "../../../hooks/useDebouncedEffect"
import { IStoreState } from "../../../redux/store"
import { client as searchClient } from "../../../server/services/search.service"
import Input from "../../form/Input"
import * as SC from "./search.styles"

const Search = (): JSX.Element => {
  const dispatch = useDispatch()
  const query = useSelector((state: IStoreState) => state.filters.query)
  const [input, setInput] = useState(query)

  useDebouncedEffect(
    () => {
      dispatch({ type: "SET_QUERY", payload: input })
      searchClient
        .getIndex("builds")
        .search(input)
        .then((results) => {
          dispatch({ type: "SET_BUILDS", payload: results.hits })
        })
    },
    250,
    [input]
  )

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>): void {
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
