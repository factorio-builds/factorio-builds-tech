import * as React from "react"
import { Build } from "../../../db/entities/build.entity"
import { useDistributeToColumn } from "../../../hooks/useDistributeToColumn"
import { ESortType } from "../../../types"
import BuildCard from "../BuildCard"
import BuildListLookupStats from "../BuildListLookupStats"
import BuildListSort from "../BuildListSort"
import * as SC from "./build-card-list.styles"
import { COLS, GUTTER } from "./design-tokens"

interface IBuildCardListProps {
  items: Build[]
  count: number
  totalCount: number
  lookupTime: number
  sort: ESortType
}

const BuildCardList: React.FC<IBuildCardListProps> = ({
  items,
  count,
  totalCount,
  lookupTime,
  sort,
}) => {
  const COL_COUNT = COLS
  const COL_GUTTER = GUTTER
  const CONTAINER_WIDTH = 1052 // needs to be dynamic on window resize

  const columns = useDistributeToColumn(
    items,
    COL_COUNT,
    CONTAINER_WIDTH,
    COL_GUTTER
  )

  return (
    <SC.BuildCardListWrapper>
      <SC.Header>
        <BuildListLookupStats
          count={count}
          totalCount={totalCount}
          lookupTime={lookupTime}
        />
        <BuildListSort sort={sort} />
      </SC.Header>
      <SC.Columns>
        {columns.map((items, i) => (
          <SC.Column key={i}>
            {items.map((item, i2) => (
              <SC.Item key={`${item.id}_${i}_${i2}`}>
                <BuildCard
                  name={item.name}
                  categories={item.metadata.categories}
                  // @ts-ignore
                  isBook={item.metadata.isBook}
                  image={item.image}
                  id={item.id}
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
