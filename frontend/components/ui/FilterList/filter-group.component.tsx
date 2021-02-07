import React, { useState } from "react"
import startCase from "lodash/startCase"
import Caret from "../../../icons/caret"
import { ITag } from "../../../redux/reducers/filters"
import Filter from "../Filter"
import * as SC from "./filter-list.styles"

interface IFilterGroupProps {
  name: ITag["group"]
  nodes: ITag["name"][]
}

function FilterGroup(props: IFilterGroupProps): JSX.Element {
  const [expanded, setExpanded] = useState(false)

  function toggle() {
    setExpanded((prevExpanded) => !prevExpanded)
  }

  return (
    <SC.FilterGroup>
      <SC.GroupName onClick={toggle}>
        {startCase(props.name)} <Caret inverted={expanded} />
      </SC.GroupName>

      {expanded && (
        <SC.GroupFilters orientation="vertical" gutter={4}>
          {props.nodes.map((node, index) => {
            return (
              <Filter key={index} group={props.name} name={node} text={node} />
            )
          })}
        </SC.GroupFilters>
      )}
    </SC.FilterGroup>
  )
}

export default FilterGroup
