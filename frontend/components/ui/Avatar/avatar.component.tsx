import React from "react"
import cx from "classnames"
import * as SC from "./avatar.styles"

interface IAvatarProps {
  username: string
  size: "medium" | "large"
}

function Avatar({ username, size }: IAvatarProps): JSX.Element {
  return (
    <SC.AvatarWrapper
      className={cx({
        "size-medium": size === "medium",
        "size-large": size === "large",
      })}
    >
      {username[0]}
    </SC.AvatarWrapper>
  )
}

export default Avatar
