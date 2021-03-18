import * as React from "react"
import { COLOR } from "../design/tokens/color"

interface ILineProps extends React.SVGProps<SVGSVGElement> {
  color?: string
}

export const Line = ({
  color = COLOR.FADEDBLUE900,
  ...restProps
}: ILineProps): JSX.Element => (
  <svg
    {...restProps}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 32 32"
  >
    <path fill={color} d="M6 15h20v2H6z" />
  </svg>
)
