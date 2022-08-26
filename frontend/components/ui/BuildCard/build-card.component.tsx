import React from "react"
import { usePress } from "@react-aria/interactions"
import cx from "classnames"
import Link from "next/link"
import { useRouter } from "next/router"
import { IThinBuild } from "../../../types/models"
import BuildIcon from "../BuildIcon"
import BuildImage from "../BuildImage"
import RichText from "../RichText"
import * as S from "./build-card.styles"

interface IBuildCardProps {
  title: IThinBuild["title"]
  icons: IThinBuild["icons"]
  isBook: boolean
  categories: IThinBuild["tags"]
  image: IThinBuild["_links"]["cover"]
  link: string
  tabIndex: number
}

function BuildCard({
  title,
  icons,
  isBook,
  categories = [],
  image,
  link,
  tabIndex,
  ...restProps
}: IBuildCardProps): JSX.Element {
  const router = useRouter()
  const { pressProps, isPressed } = usePress({
    onPress: () => {
      router.prefetch(link)
      router.push(link)
    },
  })

  return (
    <Link href={link}>
      <S.BuildCardWrapper
        {...pressProps}
        {...restProps}
        role="button"
        tabIndex={tabIndex}
        className={cx({ "is-pressed": isPressed })}
      >
        <S.ImageWrapper>
          <BuildImage image={image} />
        </S.ImageWrapper>
        <S.Content>
          <S.Title orientation="horizontal" gutter={8}>
            {icons.length > 0 && <BuildIcon icons={icons} />}
            <RichText
              input={title}
              prefix={
                isBook ? (
                  <img src="/img/blueprint-book.png" alt="" />
                ) : undefined
              }
            />
          </S.Title>
          <S.Categories orientation="horizontal" gutter={8}>
            {categories.map((category) => {
              return <S.Category key={category}>{category}</S.Category>
            })}
          </S.Categories>
        </S.Content>
      </S.BuildCardWrapper>
    </Link>
  )
}

export default BuildCard
