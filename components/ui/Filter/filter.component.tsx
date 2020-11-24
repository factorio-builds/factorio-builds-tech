import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { IStoreState } from "../../../redux/store"
import { ECategory, EFilterType, EState } from "../../../types"
import Checkbox from "../../form/Checkbox"

interface IFilterProps {
  filterType: EFilterType
  text: string
  name: EState | ECategory
}

function Filter(props: IFilterProps): JSX.Element {
  const checked = useSelector(
    // TODO: fix types
    // @ts-ignore
    (store: IStoreState) => store.filters[props.filterType][props.name]
  )
  const dispatch = useDispatch()

  function toggleChecked(): void {
    dispatch({
      type: "TOGGLE_FILTER",
      payload: {
        type: props.filterType,
        name: props.name,
      },
    })
  }

  return (
    <Checkbox
      id={`filter-${props.name}`}
      label={props.text}
      value={props.name}
      checked={checked}
      onChange={toggleChecked}
      inline={false}
    />
  )
}

export default Filter
