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

const BuildCardList: React.FC<IBuildCardListProps> = ({
  items,
  count,
  totalCount,
  sort,
}) => {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>()

  const { colCount, colGutter, containerWidth } = useMemo<{
    colCount: number
    colGutter: number
    containerWidth: number
  }>(() => {
    if (width === 0) {
      return { colCount: 0, colGutter: COL_GUTTER, containerWidth: width }
    }

    const totalCardsWith =
      width + COL_GUTTER - ((width + COL_GUTTER) % (CARD_WIDTH + COL_GUTTER))
    const colCount = Math.floor(totalCardsWith / CARD_WIDTH)

    return { colCount, colGutter: COL_GUTTER, containerWidth: width }
  }, [width, height])

  const columns = useDistributeToColumn(
    items,
    colCount,
    containerWidth,
    colGutter
  )

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
            {items.map((item, i2) => (
              <SC.Item key={`${item.slug}_${i}_${i2}`}>
                <BuildCard
                  title={item.title}
                  // TODO: probably switch to categories later
                  categories={item.tags}
                  icons={item.icons}
                  // TODO: fill isBook once reimplemented
                  isBook={false}
                  image={item._links.cover}
                  // TODO: switch to IThinBuild["_links"]["self"]
                  link={`${item.owner.username}/${item.slug}`}
                />
              </SC.Item>
            ))}
          </SC.Column>
        ))}
      </SC.Columns>
    </SC.BuildCardListWrapper>
  )
}

export default BuildCardList
