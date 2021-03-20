import React from "react"
import { isBook } from "../../../../utils/build"
import BlueprintItem from "../../../ui/BlueprintItem"
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
            {props.payload.data.children.map((bp) => {
              if (isBook(bp)) {
                return (
                  <BlueprintItem
                    key={bp.hash}
                    depth={0}
                    isBook={true}
                    title={bp.label}
                    icons={bp.icons}
                    description={bp.description}
                    image={bp._links?.rendering_thumb}
                    nodes={bp.children}
                  />
                )
              }

              return (
                <BlueprintItem
                  key={bp.hash}
                  depth={0}
                  isBook={false}
                  title={bp.label}
                  icons={bp.icons}
                  description={bp.description}
                  image={bp._links?.rendering_thumb}
                  entities={bp.entities}
                  tiles={bp.tiles}
                />
              )
            })}
          </>
        )}
    </Tab>
  )
}

export default BlueprintsTab
