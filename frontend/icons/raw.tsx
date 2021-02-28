import * as React from "react"
import { useUID } from "react-uid"
import { COLOR } from "../design/tokens/color"

interface IRawProps {
  color?: string
}

const Raw = ({
  color = COLOR.FADEDBLUE700,
  ...restProps
}: IRawProps): JSX.Element => {
  const uid = useUID()
  const id = `raw-${uid}`

  return (
    <svg
      {...restProps}
      width="10"
      height="10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath={`url(#${id})`} fill={color}>
        <path d="M7.932.182h-6.5C.782.182.25.672.25 1.272V8.91C.25 9.51.782 10 1.432 10h6.5c.65 0 1.182-.49 1.182-1.09V1.272c0-.6-.532-1.091-1.182-1.091zm0 8.727h-6.5V1.273h6.5v7.636z" />
        <path d="M6.922 2.5H2.5v1.09h4.422V2.5zM6.922 4.41H2.5V5.5h4.422V4.41zM6.922 6.41H2.5V7.5h4.422V6.41z" />
      </g>
      <defs>
        <clipPath id={id}>
          <path fill={color} d="M0 0h10v10H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Raw
