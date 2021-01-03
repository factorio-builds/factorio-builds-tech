import React from "react"
import { isBook } from "../../../../utils/blueprint"
import { getIcons } from "../../../../utils/build"
import BuildIcon from "../../../ui/BuildIcon"
import Stacker from "../../../ui/Stacker"
import { TTabComponent } from "../build-page.component"
import * as SC from "../build-page.styles"
import { CopyStringToClipboard } from "../clipboard-button.component"
import Tab from "./tab.component"

const BlueprintsTab: TTabComponent = (props) => {
  return (
    <Tab {...props}>
      <CopyStringToClipboard toCopy={props.build.blueprint} />

      {isBook(props.build.json) && (
        <Stacker gutter={4}>
          {props.build.json.blueprint_book.blueprints.map((bp, index) => {
            const icons = getIcons(bp.blueprint)
            return (
              <SC.BlueprintItem key={index} orientation="horizontal" gutter={5}>
                {icons && <BuildIcon icons={icons} />}
                {bp.blueprint.label}
              </SC.BlueprintItem>
            )
          })}
        </Stacker>
      )}
    </Tab>
  )
}

export default BlueprintsTab
