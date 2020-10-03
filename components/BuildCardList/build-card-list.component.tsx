import * as React from "react"
import BuildCard from "../BuildCard"
import { IBuild } from "../../types"
import * as SC from "./build-card-list.styles"

interface IBuildCardListProps {
  items: IBuild[]
}

const BuildCardList: React.FC<IBuildCardListProps> = ({ items }) => (
  <SC.BuildCardListWrapper>
    {[...items, ...items].map((item, index) => (
      <SC.Item key={item.id + index}>
        <BuildCard
          name={item.name}
          categories={item.metadata.categories}
          image={`/img/mock-image-${(index % 4) + 1}.jpg`}
          id={item.id}
        />
      </SC.Item>
    ))}
  </SC.BuildCardListWrapper>
)

export default BuildCardList
