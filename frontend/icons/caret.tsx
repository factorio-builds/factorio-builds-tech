import * as React from "react"
import { COLOR } from "../design/tokens/color"

interface ICaretProps {
  inverted?: boolean
  color?: string
}

const Caret = ({
  inverted,
  color = COLOR.LINK,
  ...restProps
}: ICaretProps): JSX.Element => {
  return (
    <svg
      {...restProps}
      style={{ transform: inverted ? "rotate(180deg)" : undefined }}
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.8901 2.95376L10.339 2.40274C10.2656 2.32916 10.181 2.29248 10.0854 2.29248C9.98999 2.29248 9.90544 2.32916 9.83201 2.40274L5.50006 6.73446L1.1683 2.40286C1.09483 2.32927 1.01028 2.2926 0.914772 2.2926C0.819222 2.2926 0.734674 2.32927 0.661245 2.40286L0.110259 2.95392C0.0366758 3.02735 0 3.1119 0 3.20745C0 3.30292 0.0367916 3.38747 0.110259 3.46089L5.24653 8.59728C5.31996 8.67075 5.40455 8.70746 5.50006 8.70746C5.59557 8.70746 5.68 8.67075 5.75339 8.59728L10.8901 3.46089C10.9635 3.38743 11 3.30288 11 3.20745C11 3.1119 10.9635 3.02735 10.8901 2.95376Z"
        fill={color}
      />
    </svg>
  )
}

export default Caret
