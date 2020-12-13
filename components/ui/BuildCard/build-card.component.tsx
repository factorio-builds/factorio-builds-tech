import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Build } from "../../../db/entities/build.entity"
import { IBlueprintIcon, IMetadata } from "../../../types"
import BuildIcon from "../BuildIcon"
import Stacker from "../Stacker"
import WithIcons from "../WithIcons"
import * as SC from "./build-card.styles"

interface IBuildCardProps {
  name: Build["name"]
  icons: IBlueprintIcon[]
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
            {icons.length > 0 && <BuildIcon icons={icons} />}
            <WithIcons input={name} />
          </SC.Title>
          <Stacker orientation="horizontal" gutter={8}>
            {categories.map((category) => {
              return <SC.Category key={category}>{category}</SC.Category>
            })}
          </Stacker>
        </SC.Content>
      </SC.BuildCardWrapper>
    </Link>
  )
}

export default BuildCard
