import React from "react"
import cx from "classnames"
import * as SC from "./container.styles"

interface IContainerProps {
  children: React.ReactNode
  direction?: "row" | "column"
  size?: "medium" | "large"
}

function Container({
  children,
  direction = "row",
  size = "large",
}: IContainerProps): JSX.Element {
  return (
    <SC.ContainerWrapper
      className={cx({
        "dir-row": direction === "row",
        "dir-column": direction !== "row",
        "size-medium": size === "medium",
        "size-large": size === "large",
      })}
    >
      {children}
    </SC.ContainerWrapper>
  )
}

export default Container
