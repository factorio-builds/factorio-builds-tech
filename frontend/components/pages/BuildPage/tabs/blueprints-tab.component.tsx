import React from "react"
import { isBook } from "../../../../utils/build"
import BlueprintItemExplorer from "../../../ui/BlueprintItemExplorer"
import { TTabComponent } from "../tabs.component"
import Tab from "./tab.component"

const BlueprintsTab: TTabComponent = (props) => {
  return (
    <Tab {...props}>
      {props.payload.loading && "loading..."}
      {props.payload.error && "error?"}

      {props.payload.data &&
        isBook(props.payload.data) &&
        isBook(props.build.latest_version.payload) && (
          <>
            <BlueprintItemExplorer type="readOnly">
              {props.payload.data.children}
            </BlueprintItemExplorer>
          </>
        )}
    </Tab>
  )
}

export default BlueprintsTab
