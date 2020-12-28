import React from "react"
import { TTabComponent } from "../build-page.component"
import * as SC from "../build-page.styles"
import { CopyStringToClipboard } from "../clipboard-button.component"
import Tab from "./tab.component"

const BlueprintStringTab: TTabComponent = (props) => {
  return (
    <Tab {...props}>
      <CopyStringToClipboard toCopy={props.build.blueprint} />

      <SC.BlueprintData
        value={props.build.blueprint}
        readOnly
        onClick={(e) => e.currentTarget.select()}
      />
    </Tab>
  )
}

export default BlueprintStringTab
