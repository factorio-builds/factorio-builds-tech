import React from "react"
import tags from "../../../tags.json"
import Stacker from "../Stacker"
import FilterGroup from "./filter-group.component"
import * as S from "./filter-list.styles"

// TODO: typesafe the tags JSON

function FilterList(): JSX.Element {
  return (
    <S.FilterListWrapper>
      <S.Title>Filter builds</S.Title>
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
    </S.FilterListWrapper>
  )
}

export default FilterList
