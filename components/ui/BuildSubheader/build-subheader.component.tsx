import React from "react"
import { Build } from "../../../db/entities/build.entity"
import { useCategories } from "../../../hooks/useCategories"
import { useGameStates } from "../../../hooks/useGameStates"
import Stacker from "../Stacker"
import * as SC from "./build-subheader.styles"

interface IBuildSubheader {
  build: Build
  isBook: boolean
}

function BuildSubheader(props: IBuildSubheader): JSX.Element {
  const { getCategory } = useCategories()
  const { getGameState } = useGameStates()

  const gameState = getGameState(props.build.metadata.state)

  return (
    <SC.BuildSubheaderWrapper>
      <Stacker gutter={4}>
        <SC.Title>
          {props.isBook && (
            <SC.Book src="/img/blueprint-book.png" alt="Blueprint book" />
          )}
          {props.build.name}
        </SC.Title>

        <SC.Subtitle>
          <Stacker orientation="horizontal" gutter={16}>
            <SC.Meta>
              {gameState.icon} {gameState.name}
            </SC.Meta>
            {props.build.metadata.categories.map((categoryName) => {
              const category = getCategory(categoryName)

              return (
                <SC.Meta key={category.name}>
                  {category.icon} {category.name}
                </SC.Meta>
              )
            })}
          </Stacker>
        </SC.Subtitle>
      </Stacker>
    </SC.BuildSubheaderWrapper>
  )
}

export default BuildSubheader
