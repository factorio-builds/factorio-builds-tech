import React from "react"
import cx from "classnames"
import * as SC from "./container.styles"

interface IContainerProps {
  children: React.ReactNode
  direction?: "row" | "column"
}

function Container({
  children,
  direction = "row",
}: IContainerProps): JSX.Element {
  return (
    <SC.ContainerWrapper
      className={cx({
        "dir-row": direction === "row",
        "dir-column": direction !== "row",
      })}
    >
      {children}
    </SC.ContainerWrapper>
  )
}

export default Container
