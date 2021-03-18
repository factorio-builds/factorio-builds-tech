import React from "react"

interface IPlusProps {
  color?: string
}

const Plus: React.FC<IPlusProps> = ({ color = "#000", ...restProps }) => (
  <svg {...restProps} fill="none" viewBox="0 0 96 100">
    <path
      stroke={color}
      strokeLinecap="round"
      strokeWidth="4"
      d="M2-2h95.36"
      transform="matrix(.003 1 -1 .00327 47.89 .32)"
    />
    <path
      stroke={color}
      strokeLinecap="round"
      strokeWidth="4"
      d="M93.63 51.5H2.37"
    />
  </svg>
)

export default Plus
