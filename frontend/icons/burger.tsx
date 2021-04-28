import * as React from "react"
import { COLOR } from "../design/tokens/color"

interface IBurgerProps extends React.SVGProps<SVGSVGElement> {
  color?: string
}

const Burger = ({ color = COLOR.FADEDBLUE700, ...restProps }: IBurgerProps): JSX.Element => {
  return (
    <svg width="16" height="13" fill="none" xmlns="http://www.w3.org/2000/svg" {...restProps}>
      <path fill={color} d="M0 0h16v1H0zM0 6h16v1H0zM0 12h16v1H0z" />
    </svg>
  )
}

export default Burger
