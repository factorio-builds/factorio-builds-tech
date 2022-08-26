import React, { useMemo, useState } from "react"
import startCase from "lodash/startCase"
import { ITag } from "../../../redux/reducers/filters"
import { useAppSelector } from "../../../redux/store"
import Filter from "../Filter"
import * as S from "./filter-list.styles"

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
    <S.FilterGroup>
      <S.GroupName onClick={toggle}>
        {startCase(props.name)}
        {selectedTags.length > 0 && (
          <S.GroupCount>{selectedTags.length}</S.GroupCount>
        )}
        <S.StyledCaret inverted={expanded} />
      </S.GroupName>

      {expanded && (
        <S.GroupFilters orientation="vertical" gutter={2}>
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
        </S.GroupFilters>
      )}
    </S.FilterGroup>
  )
}

export default FilterGroup
