import React, { useMemo } from "react"
import { IBlueprintPayload } from "../../../types/models"
import Stacker from "../Stacker"
import * as SC from "./blueprint-required-items.styles"

const countAndSort = (
  items: IBlueprintPayload["entities"] | IBlueprintPayload["tiles"]
) => {
  return Object.keys(items)
    .map((itemName) => {
      return {
        count: items[itemName],
        name: itemName,
      }
    })
    .sort((a, b) => {
      if (a.count === b.count) return 0

      return a.count < b.count ? 1 : -1
    })
}

const RequiredItem: React.FC<{ itemName: string; count: number }> = (props) => {
  return (
    <SC.WithRequiredItem orientation="horizontal" gutter={5}>
      <SC.IconImg type="item" name={props.itemName} />
      <span>{props.itemName.replace(/-/g, " ")}</span>
      <span>× {props.count}</span>
    </SC.WithRequiredItem>
  )
}

interface IBlueprintRequiredItemsProps {
  entities: IBlueprintPayload["entities"]
  tiles: IBlueprintPayload["tiles"]
}

function BlueprintRequiredItems(
  props: IBlueprintRequiredItemsProps
): JSX.Element {
  const sortedRequired = useMemo(() => {
    return {
      entities: countAndSort(props.entities),
      tiles: countAndSort(props.tiles),
    }
  }, [props.entities, props.tiles])

  return (
    <Stacker gutter={8}>
      {sortedRequired.entities.map((item) => {
        return (
          <RequiredItem
            key={item.name}
            itemName={item.name}
            count={item.count}
          />
        )
      })}
      {sortedRequired.tiles.map((item) => {
        return (
          <RequiredItem
            key={item.name}
            itemName={item.name}
            count={item.count}
          />
        )
      })}
    </Stacker>
  )
}

export default BlueprintRequiredItems
