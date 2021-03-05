import React from "react"
import { useDispatch, useSelector } from "react-redux"
import upperFirst from "lodash/upperFirst"
import { ITag } from "../../../redux/reducers/filters"
import { searchBuildsAsync } from "../../../redux/reducers/search"
import { IStoreState } from "../../../redux/store"
import Checkbox from "../../form/Checkbox"

interface IFilterProps {
  group: ITag["group"]
  icon?: JSX.Element
  text: string
  name: ITag["name"]
}

function Filter(props: IFilterProps): JSX.Element {
  const tag = useSelector((store: IStoreState) =>
    store.filters.tags.find(
      (tag) => tag.group === props.group && tag.name === props.name
    )
  )
  const dispatch = useDispatch()

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

  // this shouldn't ever happen
  if (!tag) {
    throw "Tag doesn't exist"
  }

  return (
    <Checkbox
      id={`filter-${props.name}`}
      prefix={props.icon}
      label={upperFirst(props.text)}
      value={props.name}
      checked={tag.isSelected}
      onChange={toggleChecked}
      inline={false}
    />
  )
}

export default Filter
