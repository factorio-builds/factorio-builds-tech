import React from "react"
import * as S from "../build-page.styles"
import { TTabComponent } from "../tabs.component"
import Tab from "./tab.component"

const BlueprintStringTab: TTabComponent = (props) => {
  return (
    <Tab {...props}>
      <S.BlueprintData
        value={props.build.latest_version.payload.encoded}
        readOnly
        onClick={(e) => e.currentTarget.select()}
      />
    </Tab>
  )
}

export default BlueprintStringTab
