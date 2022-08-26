import React from "react"
import * as S from "./stacker.styles"

interface IStackerProps extends React.ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode
  gutter?: number
  orientation?: "horizontal" | "vertical"
}

function Stacker({
  children,
  gutter = 16,
  orientation = "vertical",
  ...restProps
}: IStackerProps): JSX.Element {
  return (
    <S.StackerWrapper
      {...restProps}
      css={{
        "--gutter": `${gutter}px`,
      }}
      orientation={orientation}
      className={restProps.className}
    >
      {children}
    </S.StackerWrapper>
  )
}

export default Stacker
