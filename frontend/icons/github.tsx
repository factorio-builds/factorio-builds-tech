import * as React from "react"
import { useUID } from "react-uid"
import { COLOR } from "../design/tokens/color"

interface IGithubProps extends React.SVGProps<SVGSVGElement> {
  color?: string
}

const GitHub = ({
  color = COLOR.FADEDBLUE700,
  ...restProps
}: IGithubProps): JSX.Element => {
  const uid = useUID()
  const id = `github-${uid}`

  return (
    <svg
      width="16"
      height="16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <g clipPath={`url(#${id})`}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 0C3.58 0 0 3.58 0 8a8.007 8.007 0 005.47 7.592c.399.074.546-.171.546-.388 0-.191-.005-.692-.01-1.36-2.225.481-2.696-1.07-2.696-1.07-.363-.924-.889-1.174-.889-1.174-.727-.496.054-.486.054-.486.8.058 1.228.825 1.228.825.712 1.222 1.871.869 2.328.663.073-.516.28-.87.506-1.071-1.773-.196-3.64-.884-3.64-3.948 0-.875.31-1.587.826-2.147-.084-.206-.359-1.016.073-2.116 0 0 .673-.216 2.2.82A7.764 7.764 0 018 3.87a7.793 7.793 0 012.004.27c1.527-1.036 2.2-.82 2.2-.82.437 1.1.162 1.915.078 2.116.511.56.82 1.272.82 2.147 0 3.074-1.87 3.747-3.653 3.948.285.246.545.737.545 1.483 0 1.07-.01 1.93-.01 2.195 0 .216.143.462.55.383A8 8 0 0016 8.005 7.999 7.999 0 008 0z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id={id}>
          <path fill={color} d="M0 0h16v15.602H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default GitHub
