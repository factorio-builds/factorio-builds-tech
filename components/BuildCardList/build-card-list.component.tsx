import * as React from "react"
import BuildCard from "../BuildCard"
import { IBuild } from "../../types"
import * as SC from "./build-card-list.styles"

interface IBuildCardListProps {
  items: IBuild[]
}

const BuildCardList: React.FC<IBuildCardListProps> = ({ items }) => (
  <SC.BuildCardListWrapper>
    {items.map((item) => (
      <SC.Item>
        <BuildCard
          key={item.id}
          name={item.name}
          categories={item.categories}
        />
      </SC.Item>
    ))}
  </SC.BuildCardListWrapper>
)

export default BuildCardList
