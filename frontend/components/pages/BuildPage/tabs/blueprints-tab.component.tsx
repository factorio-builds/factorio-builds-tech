import React from "react"
import { isBook } from "../../../../utils/build"
import BlueprintItem from "../../../ui/BlueprintItem"
import { TTabComponent } from "../build-page.component"
import { CopyStringToClipboard } from "../clipboard-button.component"
import Tab from "./tab.component"

const BlueprintsTab: TTabComponent = (props) => {
  const encoded = props.build.latest_version.payload.encoded

  return (
    <Tab {...props}>
      <CopyStringToClipboard toCopy={encoded} />

      {props.payload.loading && "loading..."}
      {props.payload.error && "error?"}

      {props.payload.data?.children &&
        isBook(props.build.latest_version.payload) && (
          <>
            {props.payload.data.children.map((bp) => {
              return (
                <BlueprintItem
                  key={bp.hash}
                  depth={0}
                  isBook={isBook(bp)}
                  title={bp.blueprint.label}
                  icons={bp.blueprint.icons}
                  description={bp.blueprint.description}
                  // image={bp._links.cover}
                  nodes={bp.children}
                />
              )
            })}
          </>
        )}
    </Tab>
  )
}

export default BlueprintsTab
