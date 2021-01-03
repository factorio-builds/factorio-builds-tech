import React, { useMemo } from "react"
import { getCountPerItem, isBook } from "../../../../utils/blueprint"
import Stacker from "../../../ui/Stacker"
import { TTabComponent } from "../build-page.component"
import * as SC from "../build-page.styles"
import { CopyStringToClipboard } from "../clipboard-button.component"
import Tab from "./tab.component"

const RequiredItem: React.FC<{ itemName: string; count: number }> = (props) => {
  const iconSrc = `https://d3s5hh02rbjbr5.cloudfront.net/img/icons/large/${props.itemName}.png`

  return (
    <SC.WithRequiredItem orientation="horizontal" gutter={5}>
      <span>{props.count}</span>
      <SC.IconImg src={iconSrc} />
      <span>{props.itemName.replace(/-/g, " ")}</span>
    </SC.WithRequiredItem>
  )
}

const RequiredItemsTab: TTabComponent = (props) => {
  const itemsCount = useMemo(() => {
    if (!isBook(props.build.json)) {
      return getCountPerItem(props.build.json.blueprint)
    }
    return {}
  }, [props.build.blueprint])

  const sortedRequiredItems = useMemo(() => {
    return Object.keys(itemsCount)
      .map((itemName) => {
        return {
          count: itemsCount[itemName],
          name: itemName,
        }
      })
      .sort((a, b) => {
        if (a.count === b.count) return 0

        return a.count < b.count ? 1 : -1
      })
  }, [itemsCount])

  return (
    <Tab {...props}>
      <CopyStringToClipboard toCopy={props.build.blueprint} />

      {!isBook(props.build.json) && (
        <Stacker gutter={8}>
          {sortedRequiredItems.map((item) => {
            return (
              <RequiredItem
                key={item.name}
                itemName={item.name}
                count={item.count}
              />
            )
          })}
        </Stacker>
      )}
    </Tab>
  )
}

export default RequiredItemsTab
