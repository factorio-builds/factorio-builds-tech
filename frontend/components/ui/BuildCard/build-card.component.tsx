import React from "react"
import Image from "next/image"
import Link from "next/link"
import { IThinBuild } from "../../../types/models"
import BuildIcon from "../BuildIcon"
import WithIcons from "../WithIcons"
import * as SC from "./build-card.styles"

interface IBuildCardProps {
  title: IThinBuild["title"]
  icons: IThinBuild["icons"]
  isBook: boolean
  // TODO: probably switch to IMetadata["categories"] later
  categories: IThinBuild["tags"]
  image: IThinBuild["_links"]["cover"]
  // TODO: switch to IThinBuild["_links"]["self"]
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
          <SC.Title orientation="horizontal" gutter={8}>
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
          <SC.Categories orientation="horizontal" gutter={8}>
            {categories.map((category) => {
              return <SC.Category key={category}>{category}</SC.Category>
            })}
          </SC.Categories>
        </SC.Content>
      </SC.BuildCardWrapper>
    </Link>
  )
}

export default BuildCard
