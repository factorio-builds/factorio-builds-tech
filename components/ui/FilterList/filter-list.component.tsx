import React from "react"
import { EFilterType, EState, ECategory } from "../../../types"
import Filter from "../Filter"
import * as SC from "./filter-list.styles"

function FilterList(): JSX.Element {
  return (
    <SC.FilterListWrapper>
      filter builds
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
      <SC.Separator />
      <Filter
        filterType={EFilterType.CATEGORY}
        name={ECategory.BALANCER}
        text="Balancer"
      />
      <Filter
        filterType={EFilterType.CATEGORY}
        name={ECategory.SMELTING}
        text="Smelting"
      />
      <Filter
        filterType={EFilterType.CATEGORY}
        name={ECategory.TRAINS}
        text="Trains"
      />
      <Filter
        filterType={EFilterType.CATEGORY}
        name={ECategory.PRODUCTION}
        text="Production"
      />
      <Filter
        filterType={EFilterType.CATEGORY}
        name={ECategory.ENERGY}
        text="Energy"
      />
    </SC.FilterListWrapper>
  )
}

export default FilterList
