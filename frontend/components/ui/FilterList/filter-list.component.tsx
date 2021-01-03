import React from "react"
import { useCategories } from "../../../hooks/useCategories"
import { useGameStates } from "../../../hooks/useGameStates"
import { EFilterType } from "../../../types"
import Filter from "../Filter"
import Stacker from "../Stacker"
import * as SC from "./filter-list.styles"

function FilterList(): JSX.Element {
  const { categories } = useCategories()
  const { gameStates } = useGameStates()

  return (
    <SC.FilterListWrapper>
      <SC.Title>Filter builds</SC.Title>
      <Stacker gutter={8}>
        {gameStates.map((gameState) => {
          return (
            <Filter
              key={gameState.value}
              icon={gameState.icon}
              filterType={EFilterType.STATE}
              name={gameState.value}
              text={gameState.name}
            />
          )
        })}
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
