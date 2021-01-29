import React from "react"
import { TTabComponent } from "../build-page.component"
import * as SC from "../build-page.styles"
import Tab from "./tab.component"

const BlueprintStringTab: TTabComponent = (props) => {
  return (
    <Tab {...props}>
      <SC.BlueprintData
        value={props.build.latest_version.payload.encoded}
        readOnly
        onClick={(e) => e.currentTarget.select()}
      />
    </Tab>
  )
}

export default BlueprintStringTab
