import React from "react"
import * as SC from "./button.styles"

export interface IButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "success" | "alt" | "cta" | "default"
  size?: "medium" | "small"
  counter?: React.ReactText
}

const Button: React.FC<IButtonProps> = ({
  children,
  variant,
  size,
  counter,
  ...restProps
}) => {
  return (
    <SC.ButtonWrapper
      {...restProps}
      className={`variant-${variant} size-${size}`}
    >
      <SC.ButtonInner>{children}</SC.ButtonInner>
      {counter !== undefined && <SC.Counter>{counter}</SC.Counter>}
    </SC.ButtonWrapper>
  )
}

Button.defaultProps = {
  variant: "default",
  size: "medium",
}

export default Button
