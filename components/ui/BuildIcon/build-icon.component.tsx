import React from "react"
import cx from "classnames"
import { IBlueprintIcon } from "../../../types"
import ItemIcon from "../ItemIcon"
import * as SC from "./build-icon.styles"

interface IBuildIconProps {
  icons: IBlueprintIcon[]
}

function BuildIcon({ icons }: IBuildIconProps): JSX.Element {
  return (
    <SC.BuildIconWrapper
      className={cx({
        "is-large": icons.length === 1,
        "is-medium": icons.length > 1,
      })}
    >
      {icons.map((icon) => (
        <ItemIcon key={icon.index} itemName={icon.signal.name} />
      ))}
    </SC.BuildIconWrapper>
  )
}

export default BuildIcon
