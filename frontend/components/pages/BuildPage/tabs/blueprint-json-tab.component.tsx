import React from "react"
import { decodeBlueprint } from "../../../../utils/blueprint"
import { TTabComponent } from "../build-page.component"
import * as SC from "../build-page.styles"
import Tab from "./tab.component"

const BlueprintJsonTab: TTabComponent = (props) => {
  const encoded = props.build.latest_version.payload.encoded
  const parsed = React.useMemo(() => {
    const decoded = decodeBlueprint(props.build.latest_version.payload.encoded)
    return {
      json: decoded,
      stringified: JSON.stringify(decoded, null, 1),
    }
  }, [encoded])

  return (
    <Tab {...props}>
      <SC.BlueprintData
        value={parsed.stringified}
        readOnly
        onClick={(e) => e.currentTarget.select()}
      />
    </Tab>
  )
}

export default BlueprintJsonTab
