import React from "react"
import Image from "next/image"
import Link from "next/link"
import { IIndexedBuild } from "../../../types"
import BuildIcon from "../BuildIcon"
import Stacker from "../Stacker"
import WithIcons from "../WithIcons"
import * as SC from "./build-card.styles"

interface IBuildCardProps {
  title: IIndexedBuild["title"]
  icons: IIndexedBuild["icons"]
  isBook: boolean
  // TODO: probably switch to IMetadata["categories"] later
  categories: IIndexedBuild["tags"]
  image: IIndexedBuild["_links"]["cover"]
  // TODO: switch to IIndexedBuild["_links"]["self"]
  link: string
}

function BuildCard({
  title,
  icons,
  isBook,
  categories = [],
  image,
  link,
}: IBuildCardProps): JSX.Element {
  return (
    <Link href={link}>
      <SC.BuildCardWrapper>
        <SC.ImageWrapper>
          <Image
            src={image.href}
            alt=""
            width={image.width}
            height={image.height}
            layout="responsive"
          />
        </SC.ImageWrapper>
        <SC.Content>
          <SC.Title>
            {icons.length > 0 && <BuildIcon icons={icons} />}
            <WithIcons
              input={title}
              prefix={
                isBook ? (
                  <img src="/img/blueprint-book.png" alt="" />
                ) : undefined
              }
            />
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
