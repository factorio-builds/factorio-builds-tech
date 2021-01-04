import React from "react"
import { isBook } from "../../../../utils/build"
import BuildIcon from "../../../ui/BuildIcon"
import Stacker from "../../../ui/Stacker"
import { TTabComponent } from "../build-page.component"
import * as SC from "../build-page.styles"
import { CopyStringToClipboard } from "../clipboard-button.component"
import Tab from "./tab.component"

const BlueprintsTab: TTabComponent = (props) => {
  const encoded = props.build.latest_version.payload.encoded

  return (
    <Tab {...props}>
      <CopyStringToClipboard toCopy={encoded} />

      {props.payload.loading && "loading..."}
      {props.payload.error && "error?"}

      {!props.payload.loading &&
        !props.payload.error &&
        props.payload.data &&
        isBook(props.build) && (
          <Stacker gutter={4}>
            {/* TODO: remove once API/payload is typed */}
            {(props.payload.data as any).children.map((bp) => {
              return (
                <SC.BlueprintItem
                  key={bp.hash}
                  orientation="horizontal"
                  gutter={5}
                >
                  {bp.blueprint.icons && (
                    <BuildIcon icons={bp.blueprint.icons} />
                  )}
                  <span>{bp.blueprint.label}</span>
                </SC.BlueprintItem>
              )
            })}
          </Stacker>
        )}
    </Tab>
  )
}

export default BlueprintsTab
