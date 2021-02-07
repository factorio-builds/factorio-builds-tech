import React from "react"
import tags from "../../../tags.json"
import Stacker from "../Stacker"
import FilterGroup from "./filter-group.component"
import * as SC from "./filter-list.styles"

// TODO: typesafe the tags JSON

function FilterList(): JSX.Element {
  return (
    <SC.FilterListWrapper>
      <SC.Title>Filter builds</SC.Title>
      <Stacker gutter={0}>
        {Object.keys(tags).map((tagCategory) => {
          const tagGroup = tags[tagCategory as keyof typeof tags]

          return (
            <FilterGroup
              key={tagCategory}
              // TODO: typesafe the JSON
              // @ts-ignore
              name={tagCategory}
              // @ts-ignore
              nodes={tagGroup}
            />
          )
        })}
      </Stacker>
    </SC.FilterListWrapper>
  )
}

export default FilterList
