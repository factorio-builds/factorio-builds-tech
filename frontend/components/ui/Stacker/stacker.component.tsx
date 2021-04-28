import React from "react"
import cx from "classnames"
import * as SC from "./stacker.styles"

interface IStackerProps extends React.ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode
  gutter?: number
  orientation?: "horizontal" | "vertical"
}

function Stacker({ children, gutter = 16, orientation = "vertical", ...restProps }: IStackerProps): JSX.Element {
  return (
    <SC.StackerWrapper
      {...restProps}
      gutter={gutter}
      className={cx(restProps.className, {
        "dir-horizontal": orientation === "horizontal",
        "dir-vertical": orientation !== "horizontal",
      })}
    >
      {children}
    </SC.StackerWrapper>
  )
}

export default Stacker
