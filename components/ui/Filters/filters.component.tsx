import React from "react"
import { EFilterType, EState, ECategory } from "../../../types"
import FilterCheckbox from "../FilterCheckbox"
import * as SC from "./filters.styles"

function Filters(): JSX.Element {
  return (
    <SC.FiltersWrapper>
      filter builds
      <FilterCheckbox
        filterType={EFilterType.STATE}
        name={EState.EARLY_GAME}
        text="Early-game"
      />
      <FilterCheckbox
        filterType={EFilterType.STATE}
        name={EState.MID_GAME}
        text="Mid-game"
      />
      <FilterCheckbox
        filterType={EFilterType.STATE}
        name={EState.LATE_GAME}
        text="Late-game"
      />
      <SC.Separator />
      <FilterCheckbox
        filterType={EFilterType.CATEGORY}
        name={ECategory.BALANCER}
        text="Balancer"
      />
      <FilterCheckbox
        filterType={EFilterType.CATEGORY}
        name={ECategory.SMELTING}
        text="Smelting"
      />
      <FilterCheckbox
        filterType={EFilterType.CATEGORY}
        name={ECategory.TRAINS}
        text="Trains"
      />
      <FilterCheckbox
        filterType={EFilterType.CATEGORY}
        name={ECategory.PRODUCTION}
        text="Production"
      />
      <FilterCheckbox
        filterType={EFilterType.CATEGORY}
        name={ECategory.ENERGY}
        text="Energy"
      />
    </SC.FiltersWrapper>
  )
}

export default Filters
