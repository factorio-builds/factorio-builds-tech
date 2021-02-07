import React, { useMemo } from "react"
import { IBlueprintPayload } from "../../../types/models"
import Stacker from "../Stacker"
import * as SC from "./blueprint-required-items.styles"

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
  blueprintPayload: IBlueprintPayload
}

function BlueprintRequiredItems(
  props: IBlueprintRequiredItemsProps
): JSX.Element {
  const sortedRequiredItems = useMemo(() => {
    const entities = props.blueprintPayload.entities

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
  }, [props.blueprintPayload.hash])

  return (
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
  )
}

export default BlueprintRequiredItems
