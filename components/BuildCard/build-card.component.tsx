import React from "react"
import { IBuild } from "../../types"
import * as SC from "./build-card.styles"

interface IBuildCardProps {
  name: IBuild["name"]
  categories: IBuild["categories"]
}

function BuildCard({ name, categories = [] }: IBuildCardProps): JSX.Element {
  return (
    <SC.BuildCardWrapper>
      <SC.Content>
        <SC.Title>{name}</SC.Title>
        <SC.Categories>
          {categories.map((category) => {
            return <SC.CategoryPill>{category}</SC.CategoryPill>
          })}
        </SC.Categories>
      </SC.Content>
    </SC.BuildCardWrapper>
  )
}

export default BuildCard
