import React from "react"
import { useCategories } from "../../../hooks/useCategories"
import { EFilterType, EState } from "../../../types"
import Filter from "../Filter"
import Stacker from "../Stacker"
import * as SC from "./filter-list.styles"

function FilterList(): JSX.Element {
  const { categories } = useCategories()

  return (
    <SC.FilterListWrapper>
      <SC.Title>Filter builds</SC.Title>
      <Stacker gutter={8}>
        <Filter
          filterType={EFilterType.STATE}
          name={EState.EARLY_GAME}
          text="Early-game"
        />
        <Filter
          filterType={EFilterType.STATE}
          name={EState.MID_GAME}
          text="Mid-game"
        />
        <Filter
          filterType={EFilterType.STATE}
          name={EState.LATE_GAME}
          text="Late-game"
        />
      </Stacker>
      <SC.Separator />
      <Stacker gutter={8}>
        {categories.map((category) => {
          return (
            <Filter
              key={category.value}
              icon={category.icon}
              filterType={EFilterType.CATEGORY}
              name={category.value}
              text={category.name}
            />
          )
        })}
      </Stacker>
    </SC.FilterListWrapper>
  )
}

export default FilterList
