import React from "react"
import Stacker from "../../../ui/Stacker"
import { TTabComponent } from "../build-page.component"
import * as SC from "../build-page.styles"
import {
  CopyJsonToClipboard,
  CopyStringToClipboard,
} from "../clipboard-button.component"
import Tab from "./tab.component"

const BlueprintJsonTab: TTabComponent = (props) => {
  const stringifiedValue = React.useMemo(
    () => JSON.stringify(props.build.json, null, 1),
    [props.build.blueprint]
  )

  return (
    <Tab {...props}>
      <Stacker orientation="horizontal" gutter={8}>
        <CopyStringToClipboard toCopy={props.build.blueprint} />{" "}
        <CopyJsonToClipboard toCopy={props.build.json} />
      </Stacker>

      <SC.BlueprintData
        value={stringifiedValue}
        readOnly
        onClick={(e) => e.currentTarget.select()}
      />
    </Tab>
  )
}

export default BlueprintJsonTab
