import * as React from "react"
import BuildCard from "../BuildCard"
import { IBuild } from "../../types"
import { mockedImages } from "../../utils/mock-images-data"
import { useDistributeToColumn } from "../../hooks/useDistributeToColumn"
import * as SC from "./build-card-list.styles"
import { COLS, GUTTER } from "./design-tokens"

interface IBuildCardListProps {
  items: IBuild[]
}

const BuildCardList: React.FC<IBuildCardListProps> = ({ items }) => {
  const COL_COUNT = COLS
  const COL_GUTTER = GUTTER
  const CONTAINER_WIDTH = 1052 // needs to be dynamic on window resize

  const tempItems = [...items, ...items, ...items, ...items, ...items]
  const tempFakedItems = tempItems.map((item, index) => {
    return {
      ...item,
      image: mockedImages[index % 5],
    }
  })

  const columns = useDistributeToColumn(
    tempFakedItems,
    COL_COUNT,
    CONTAINER_WIDTH,
    COL_GUTTER
  )

  return (
    <SC.BuildCardListWrapper>
      {columns.map((items, i) => (
        <SC.Column key={i}>
          {items.map((item, i2) => (
            <SC.Item key={`${item.id}_${i}_${i2}`}>
              <BuildCard
                name={item.name}
                categories={item.metadata.categories}
                // @ts-ignore
                isBook={item.isBook}
                image={item.image.src}
                id={item.id}
              />
            </SC.Item>
          ))}
        </SC.Column>
      ))}
    </SC.BuildCardListWrapper>
  )
}

export default BuildCardList
