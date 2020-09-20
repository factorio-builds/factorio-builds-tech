import cx from "classnames"
import React, { useState } from "react"
import { ECategory, EFilterType, EState } from "../../types"
import * as SC from "./checkbox.styles"

interface ICheckboxProps {
  filterType: EFilterType
  text: string
  name: EState | ECategory
}

function Checkbox(props: ICheckboxProps): JSX.Element {
  const [checked, setChecked] = useState(false)

  function toggleChecked(): void {
    setChecked((prevState) => !prevState)
  }

  return (
    <SC.CheckboxWrapper onClick={toggleChecked}>
      <SC.Square className={cx({ "is-checked": checked })} />
      <SC.Text>{props.text}</SC.Text>
    </SC.CheckboxWrapper>
  )
}

export default Checkbox
