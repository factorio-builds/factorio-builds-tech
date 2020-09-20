import React from "react"
import { EFilterType, EState, ECategory } from "../../types"
import Checkbox from "../Checkbox"
import * as SC from "./filters.styles"

function Filters(): JSX.Element {
  return (
    <SC.FiltersWrapper>
      filter builds
      <Checkbox
        filterType={EFilterType.STATE}
        name={EState.EARLY_GAME}
        text="Early-game"
      />
      <Checkbox
        filterType={EFilterType.STATE}
        name={EState.MID_GAME}
        text="Mid-game"
      />
      <Checkbox
        filterType={EFilterType.STATE}
        name={EState.LATE_GAME}
        text="Late-game"
      />
      <SC.Separator />
      <Checkbox
        filterType={EFilterType.CATEGORY}
        name={ECategory.BALANCER}
        text="Balancer"
      />
      <Checkbox
        filterType={EFilterType.CATEGORY}
        name={ECategory.SMELTING}
        text="Smelting"
      />
      <Checkbox
        filterType={EFilterType.CATEGORY}
        name={ECategory.TRAINS}
        text="Trains"
      />
      <Checkbox
        filterType={EFilterType.CATEGORY}
        name={ECategory.PRODUCTION}
        text="Production"
      />
    </SC.FiltersWrapper>
  )
}

export default Filters
