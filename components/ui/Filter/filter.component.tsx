import React from "react"
import { useDispatch, useSelector } from "react-redux"
import cx from "classnames"
import { IStoreState } from "../../../redux/store"
import { ECategory, EFilterType, EState } from "../../../types"
import * as SC from "./filter.styles"

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
    <SC.FilterWrapper onClick={toggleChecked}>
      <SC.Square className={cx({ "is-checked": checked })} />
      <SC.Text>{props.text}</SC.Text>
    </SC.FilterWrapper>
  )
}

export default Filter
