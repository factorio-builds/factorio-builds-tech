import React from "react"
import cx from "classnames"
import * as S from "./button.styles"

export interface IButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  as?: keyof JSX.IntrinsicElements
  variant?: "success" | "alt" | "cta" | "default"
  size?: "medium" | "small"
  counter?: React.ReactText
}

const Button: React.FC<IButtonProps> = ({
  as = "button",
  children,
  variant,
  size,
  counter,
  ...restProps
}) => {
  return (
    <S.ButtonWrapper
      {...restProps}
      as={as}
      className={cx(restProps.className, `variant-${variant} size-${size}`)}
    >
      <S.ButtonInner>{children}</S.ButtonInner>
      {counter !== undefined && <S.Counter>{counter}</S.Counter>}
    </S.ButtonWrapper>
  )
}

Button.defaultProps = {
  variant: "default",
  size: "medium",
}

export default Button
