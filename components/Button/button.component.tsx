import React from "react"
import * as SC from "./button.styles"

interface IButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "success" | "default"
}

const Button: React.FC<IButtonProps> = ({
  variant,
  children,
  ...restProps
}) => {
  return (
    <SC.ButtonWrapper {...restProps} className={`variant-${variant}`}>
      {children}
    </SC.ButtonWrapper>
  )
}

Button.defaultProps = {
  variant: "default",
}

export default Button
