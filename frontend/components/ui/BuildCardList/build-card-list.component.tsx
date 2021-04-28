import * as React from "react"
import { useMemo } from "react"
import { useMeasure } from "react-use"
import { useDistributeToColumn } from "../../../hooks/useDistributeToColumn"
import { ESortDirection, ESortType } from "../../../types"
import { IThinBuild } from "../../../types/models"
import BuildCard from "../BuildCard"
import BuildListLookupStats from "../BuildListLookupStats"
import BuildListSort from "../BuildListSort"
import * as SC from "./build-card-list.styles"

interface IBuildCardListProps {
  items: IThinBuild[]
  count: number
  totalCount: number
  sort: {
    type: ESortType
    direction: ESortDirection
  }
}

const CARD_WIDTH = 300
const COL_GUTTER = 16

const BuildCardList: React.FC<IBuildCardListProps> = ({ items, count, totalCount, sort }) => {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>()

  const { colCount, colGutter, containerWidth } = useMemo<{
    colCount: number
    colGutter: number
    containerWidth: number
  }>(() => {
    if (width === 0) {
      return { colCount: 0, colGutter: COL_GUTTER, containerWidth: width }
    }

    const totalCardsWith = width + COL_GUTTER - ((width + COL_GUTTER) % (CARD_WIDTH + COL_GUTTER))
    const colCount = Math.floor(totalCardsWith / CARD_WIDTH)

    return { colCount, colGutter: COL_GUTTER, containerWidth: width }
  }, [width, height])

  const columns = useDistributeToColumn(
    items,
    colCount,
    containerWidth,
    colGutter,
    100 // extra wiggle room to account for card information
  )

  const tabIndexes = useMemo(() => {
    if (typeof window !== "undefined") {
      return Array.from(document.querySelectorAll("[data-slug]"))
        .reduce((acc, card) => {
          const slug = card.getAttribute("data-slug") as string
          const boundingRect = card.getBoundingClientRect()
          return [
            ...acc,
            {
              slug,
              top: boundingRect.top,
              left: boundingRect.left,
            },
          ]
        }, [] as { slug: string; top: number; left: number }[])
        .sort((a, b) => a.top - b.top)
    }

    return []
  }, [columns, items, containerWidth])

  return (
    <SC.BuildCardListWrapper>
      <SC.Header>
        <BuildListLookupStats count={count} totalCount={totalCount} />
        <BuildListSort sort={sort} />
      </SC.Header>
      <SC.Columns
        ref={ref}
        style={
          {
            "--cols": colCount,
            "--gutter": `${colGutter}px`,
          } as React.CSSProperties
        }
      >
        {columns.map((items, i) => (
          <SC.Column key={i}>
            {items.map((item, i2) => {
              const slug = `${item.owner.username}/${item.slug}`

              return (
                <SC.Item key={`${item.slug}_${i}_${i2}`}>
                  <BuildCard
                    tabIndex={tabIndexes.findIndex((index) => index.slug === slug) + 1}
                    data-slug={slug}
                    title={item.title}
                    categories={item.tags}
                    icons={item.icons}
                    // TODO: fill isBook once reimplemented
                    isBook={false}
                    image={item._links.cover}
                    link={slug}
                  />
                </SC.Item>
              )
            })}
          </SC.Column>
        ))}
      </SC.Columns>
    </SC.BuildCardListWrapper>
  )
}

export default BuildCardList
