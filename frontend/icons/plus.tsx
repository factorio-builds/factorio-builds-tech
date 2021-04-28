import React from "react"

interface IPlusProps extends React.SVGProps<SVGSVGElement> {
  color?: string
}

const Plus = ({ color = "#000", ...restProps }: IPlusProps): JSX.Element => (
  <svg fill="none" viewBox="0 0 96 100" {...restProps}>
    <path
      stroke={color}
      strokeLinecap="round"
      strokeWidth="4"
      d="M2-2h95.36"
      transform="matrix(.003 1 -1 .00327 47.89 .32)"
    />
    <path stroke={color} strokeLinecap="round" strokeWidth="4" d="M93.63 51.5H2.37" />
  </svg>
)

export default Plus
