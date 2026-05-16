import React from "react"
import { IBookPayload, IFullPayload } from "../../../types/models"
import { isBook } from "../../../utils/build"
import BlueprintItem from "../BlueprintItem"
import BlueprintItemExplorerContext, {
  IBlueprintItemExplorerContext,
} from "./blueprint-item-explorer.provider"

interface IBaseBlueprintItemExplorerProps {
  children: IBookPayload["children"]
}

interface IBlueprintItemExplorerPropsReadonly
  extends IBaseBlueprintItemExplorerProps {
  type: "readOnly"
}

interface IBlueprintItemExplorerPropsSelectable
  extends IBaseBlueprintItemExplorerProps {
  type: "selectable"
  onSelect: (e: React.MouseEvent, hash: IFullPayload["hash"]) => void
  selectedHash: IFullPayload["hash"] | null
}

type IBlueprintItemExplorerProps =
  | IBlueprintItemExplorerPropsReadonly
  | IBlueprintItemExplorerPropsSelectable

function BlueprintItemExplorer(
  props: IBlueprintItemExplorerProps
): JSX.Element {
  const createContextValue = (): IBlueprintItemExplorerContext => {
    if (props.type === "readOnly") {
      return {
        type: "readOnly",
      }
    }

    return {
      type: "selectable",
      onSelect: props.onSelect,
      selectedHash: props.selectedHash,
    }
  }

  return (
    <BlueprintItemExplorerContext.Provider value={createContextValue()}>
      {props.children.map((bp) => {
        if (isBook(bp)) {
          return (
            <BlueprintItem
              key={bp.hash}
              hash={bp.hash}
              depth={0}
              isBook={true}
              title={bp.label}
              icons={bp.icons}
              description={bp.description}
              image={bp._links?.rendering}
              nodes={bp.children}
            />
          )
        }

        return (
          <BlueprintItem
            key={bp.hash}
            hash={bp.hash}
            depth={0}
            isBook={false}
            title={bp.label}
            icons={bp.icons}
            description={bp.description}
            image={bp._links?.rendering}
            raw={bp._links?.raw}
            encoded={bp.encoded}
            entities={bp.entities}
            tiles={bp.tiles}
          />
        )
      })}
    </BlueprintItemExplorerContext.Provider>
  )
}

export default BlueprintItemExplorer
