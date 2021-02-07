import React from "react"
import { isBook } from "../../../../utils/build"
import BlueprintRequiredItems from "../../../ui/BlueprintRequiredItems"
import { TTabComponent } from "../build-page.component"
import Tab from "./tab.component"

const RequiredItemsTab: TTabComponent = (props) => {
  return (
    <Tab {...props}>
      {!isBook(props.build.latest_version.payload) && (
        <BlueprintRequiredItems
          entities={props.build.latest_version.payload.entities}
        />
      )}
    </Tab>
  )
}

export default RequiredItemsTab
