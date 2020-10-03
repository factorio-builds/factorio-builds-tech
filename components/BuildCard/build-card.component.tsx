import React from "react"
import { IBuild, IMetadata } from "../../types"
import * as SC from "./build-card.styles"
import Link from "next/link"

interface IBuildCardProps {
  name: IBuild["name"]
  isBook: boolean
  categories: IMetadata["categories"]
  image: string
  id: IBuild["id"]
}

function BuildCard({
  name,
  isBook,
  categories = [],
  image,
  id,
}: IBuildCardProps): JSX.Element {
  return (
    <Link href={`/build/${id}`}>
      <SC.BuildCardWrapper>
        <SC.BackgroundImage src={image} alt="" />
        <SC.Content>
          <SC.Title>
            {isBook && <SC.Book src="/img/blueprint-book.png" />}
            {name}
          </SC.Title>
          <SC.Categories>
            {categories.map((category) => {
              return (
                <SC.CategoryPill key={category}>{category}</SC.CategoryPill>
              )
            })}
          </SC.Categories>
        </SC.Content>
      </SC.BuildCardWrapper>
    </Link>
  )
}

export default BuildCard
