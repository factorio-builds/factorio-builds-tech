import React, { useMemo } from "react"
import { isBook } from "../../../../utils/build"
import Stacker from "../../../ui/Stacker"
import { TTabComponent } from "../build-page.component"
import * as SC from "../build-page.styles"
import { CopyStringToClipboard } from "../clipboard-button.component"
import Tab from "./tab.component"

const RequiredItem: React.FC<{ itemName: string; count: number }> = (props) => {
  return (
    <SC.WithRequiredItem orientation="horizontal" gutter={5}>
      <span>{props.count}</span>
      <SC.IconImg type="item" name={props.itemName} />
      <span>{props.itemName.replace(/-/g, " ")}</span>
    </SC.WithRequiredItem>
  )
}

const RequiredItemsTab: TTabComponent = (props) => {
  const encoded = props.build.latest_version.payload.encoded

  const sortedRequiredItems = useMemo(() => {
    // shouldn't ever happen, this component is not rendered for books
    if (!props.payload.data || isBook(props.payload.data)) {
      return []
    }

    const entities = props.payload.data.entities

    return Object.keys(entities)
      .map((itemName) => {
        return {
          count: entities[itemName],
          name: itemName,
        }
      })
      .sort((a, b) => {
        if (a.count === b.count) return 0

        return a.count < b.count ? 1 : -1
      })
  }, [props.payload.data])

  return (
    <Tab {...props}>
      <CopyStringToClipboard toCopy={encoded} />

      {!isBook(props.build.latest_version.payload) && (
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
