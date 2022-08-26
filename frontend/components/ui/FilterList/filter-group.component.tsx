import React, { useMemo, useState } from "react"
import startCase from "lodash/startCase"
import { ITag } from "../../../redux/reducers/filters"
import { useAppSelector } from "../../../redux/store"
import Filter from "../Filter"
import * as SC from "./filter-list.styles"

interface IFilterGroupProps {
  name: ITag["group"]
  nodes: ITag["name"][]
}

function FilterGroup(props: IFilterGroupProps): JSX.Element {
  const tags = useAppSelector((store) =>
    store.filters.tags.filter(
      (tag) => tag.group === props.name && props.nodes.includes(tag.name)
    )
  )
  const [expanded, setExpanded] = useState(false)

  function toggle() {
    setExpanded((prevExpanded) => !prevExpanded)
  }

  const selectedTags = useMemo(() => {
    return tags.filter((tag) => tag.isSelected)
  }, [tags])

  return (
    <SC.FilterGroup>
      <SC.GroupName onClick={toggle}>
        {startCase(props.name)}
        {selectedTags.length > 0 && (
          <SC.GroupCount>{selectedTags.length}</SC.GroupCount>
        )}
        <SC.StyledCaret inverted={expanded} />
      </SC.GroupName>

      {expanded && (
        <SC.GroupFilters orientation="vertical" gutter={2}>
          {tags.map((node, index) => {
            return (
              <Filter
                key={index}
                group={node.group}
                name={node.name}
                isSelected={node.isSelected}
                text={node.name}
              />
            )
          })}
        </SC.GroupFilters>
      )}
    </SC.FilterGroup>
  )
}

export default FilterGroup
