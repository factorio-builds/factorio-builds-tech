import cx from "classnames"
import React, { useState } from "react"
import { ECategory, EFilterType, EState } from "../../types"
import * as SC from "./filter-checkbox.styles"

interface IFilterCheckboxProps {
  filterType: EFilterType
  text: string
  name: EState | ECategory
}

function FilterCheckbox(props: IFilterCheckboxProps): JSX.Element {
  const [checked, setChecked] = useState(false)

  function toggleChecked(): void {
    setChecked((prevState) => !prevState)
  }

  return (
    <SC.FilterCheckboxWrapper onClick={toggleChecked}>
      <SC.Square className={cx({ "is-checked": checked })} />
      <SC.Text>{props.text}</SC.Text>
    </SC.FilterCheckboxWrapper>
  )
}

export default FilterCheckbox
