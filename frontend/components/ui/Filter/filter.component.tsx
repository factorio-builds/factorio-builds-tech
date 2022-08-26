import React from "react"
import upperFirst from "lodash/upperFirst"
import { ITag } from "../../../redux/reducers/filters"
import { searchBuildsAsync } from "../../../redux/reducers/search"
import { useAppDispatch } from "../../../redux/store"
import Checkbox from "../../form/Checkbox"

interface IFilterProps {
  group: ITag["group"]
  icon?: JSX.Element
  text: string
  isSelected: boolean
  name: ITag["name"]
}

function Filter(props: IFilterProps): JSX.Element {
  const dispatch = useAppDispatch()

  function toggleChecked(): void {
    dispatch({
      type: "TOGGLE_FILTER",
      payload: {
        group: props.group,
        name: props.name,
      },
    })
    dispatch(searchBuildsAsync())
  }

  return (
    <Checkbox
      id={`filter-${props.name}`}
      prefix={props.icon}
      label={upperFirst(props.text)}
      value={props.name}
      checked={props.isSelected}
      onChange={toggleChecked}
      inline={false}
    />
  )
}

export default Filter
