import * as React from "react"
import { COLOR } from "../design/tokens/color"

interface IEditorProps {
  color?: string
}

const Editor = ({
  color = COLOR.FADEDBLUE700,
  ...restProps
}: IEditorProps): JSX.Element => {
  return (
    <svg
      {...restProps}
      width="9"
      height="9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 8H2v1h1V8zM7 8H6v1h1V8zM9 8H8v1h1V8zM5 8H4v1h1V8zM9 6H8v1h1V6z"
        fill={color}
      />
      <path d="M0 0v9h1V1h8V0H0zM9 4H8v1h1V4z" fill={color} />
      <path d="M9 2H8v1h1V2z" fill={color} />
    </svg>
  )
}

export default Editor
