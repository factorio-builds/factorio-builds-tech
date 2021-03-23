import React, { useContext } from "react"
import { IFullPayload } from "../../../types/models"

interface IBlueprintItemExplorerContextSelectable {
  type: "selectable"
  onSelect: (e: React.MouseEvent, hash: IFullPayload["hash"]) => void
  selectedHash: IFullPayload["hash"] | null
}

interface IBlueprintItemExplorerContextReadonly {
  type: "readOnly"
}

export type IBlueprintItemExplorerContext =
  | IBlueprintItemExplorerContextSelectable
  | IBlueprintItemExplorerContextReadonly

const BlueprintItemExplorerContext = React.createContext<IBlueprintItemExplorerContext | null>(
  null
)

export const useBlueprintItemExplorer = () => {
  const context = useContext(BlueprintItemExplorerContext)

  if (!context) {
    throw "Missing BlueprintItemExplorerContext"
  }

  return context
}

export default BlueprintItemExplorerContext
