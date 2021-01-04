import * as React from "react"
import sortBy from "lodash/sortBy"
import { useDistributeToColumn } from "../../../hooks/useDistributeToColumn"
import { ESortType } from "../../../types"
import { IThinBuild } from "../../../types/models"
import BuildCard from "../BuildCard"
import BuildListLookupStats from "../BuildListLookupStats"
import BuildListSort from "../BuildListSort"
import * as SC from "./build-card-list.styles"
import { COLS, GUTTER } from "./design-tokens"

interface IBuildCardListProps {
  items: IThinBuild[]
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

  // TODO: send logic to search API
  const sortedItems = React.useMemo(() => {
    if (sort === ESortType.NEWEST) {
      return sortBy(items, [(item) => Date.parse(item.updated_at)]).reverse()
    }

    if (sort === ESortType.VIEWS) {
      return sortBy(items, ["views"]).reverse()
    }

    return items
  }, [JSON.stringify(items), sort])

  const columns = useDistributeToColumn(
    sortedItems,
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
