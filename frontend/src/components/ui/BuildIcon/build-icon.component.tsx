import React from "react"
import cx from "classnames"
import { IIcon } from "../../../types/models"
import ItemIcon from "../ItemIcon"
import * as S from "./build-icon.styles"

interface IBuildIconProps {
  icons: IIcon[]
  size?: "medium" | "large"
}

function BuildIcon({ icons, size = "medium" }: IBuildIconProps): JSX.Element {
  return (
    <S.BuildIconWrapper
      className={cx({
        "large-icons": icons.length === 1,
        "medium-icons": icons.length > 1,
        "size-medium": size === "medium",
        "size-large": size === "large",
      })}
    >
      {icons.map((icon, index) => (
        <ItemIcon key={index} type={icon.type} name={icon.name} />
      ))}
    </S.BuildIconWrapper>
  )
}

export default BuildIcon
