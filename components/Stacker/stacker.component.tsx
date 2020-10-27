import React from "react"
import cx from "classnames"
import * as SC from "./stacker.styles"

interface IStackerProps {
  children: React.ReactNode
  gutter?: number
  orientation?: "horizontal" | "vertical"
}

function Stacker({
  children,
  gutter = 16,
  orientation = "vertical",
}: IStackerProps): JSX.Element {
  return (
    <SC.StackerWrapper
      gutter={gutter}
      className={cx({
        "dir-horizontal": orientation === "horizontal",
        "dir-vertical": orientation !== "horizontal",
      })}
    >
      {children}
    </SC.StackerWrapper>
  )
}

export default Stacker
