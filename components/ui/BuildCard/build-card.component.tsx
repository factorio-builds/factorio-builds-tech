import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Build } from "../../../db/entities/build.entity"
import { IBlueprintIcon, IMetadata } from "../../../types"
import BuildIcon from "../BuildIcon"
import WithIcons from "../WithIcons"
import * as SC from "./build-card.styles"

interface IBuildCardProps {
  name: Build["name"]
  icons: IBlueprintIcon[] | void
  isBook: boolean
  categories: IMetadata["categories"]
  image: Build["image"]
  id: Build["id"]
}

function BuildCard({
  name,
  icons,
  isBook,
  categories = [],
  image,
  id,
}: IBuildCardProps): JSX.Element {
  return (
    <Link href={`/build/${id}`}>
      <SC.BuildCardWrapper>
        <SC.ImageWrapper>
          <Image
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            layout="responsive"
          />
        </SC.ImageWrapper>
        <SC.Content>
          <SC.Title>
            {isBook && <SC.Book src="/img/blueprint-book.png" />}
            {icons && <BuildIcon icons={icons} />}
            <WithIcons input={name} />
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
