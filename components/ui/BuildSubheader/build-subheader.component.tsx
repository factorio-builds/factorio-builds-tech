import React from "react"
import { Build } from "../../../db/entities/build.entity"
import { useCategories } from "../../../hooks/useCategories"
import Stacker from "../Stacker"
import * as SC from "./build-subheader.styles"

interface IBuildSubheader {
  build: Build
  isBook: boolean
}

function BuildSubheader(props: IBuildSubheader): JSX.Element {
  const { getCategory } = useCategories()

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
          <Stacker gutter={16}>
            {props.build.metadata.categories.map((categoryName) => {
              const category = getCategory(categoryName)

              return (
                <SC.Category key={category.name}>
                  {category.icon} {category.name}
                </SC.Category>
              )
            })}
          </Stacker>
        </SC.Subtitle>
      </Stacker>
    </SC.BuildSubheaderWrapper>
  )
}

export default BuildSubheader
