import React from "react"
import cx from "classnames"
import * as S from "./container.styles"

interface IContainerProps {
  children: React.ReactNode
  direction?: "row" | "column"
  size?: "small" | "medium" | "large"
}

function Container({
  children,
  direction = "row",
  size = "large",
}: IContainerProps): JSX.Element {
  return (
    <S.ContainerWrapper
      className={cx({
        "dir-row": direction === "row",
        "dir-column": direction !== "row",
        "size-small": size === "small",
        "size-medium": size === "medium",
        "size-large": size === "large",
      })}
    >
      {children}
    </S.ContainerWrapper>
  )
}

export default Container
