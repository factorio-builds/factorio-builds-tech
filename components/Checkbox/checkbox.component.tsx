import React from "react"
import cx from "classnames"
import { FieldProps } from "formik"
import * as SC from "./checkbox.styles"

interface ICheckboxProps extends FieldProps {
  id: string
  label: string
  text?: string
  inline?: boolean
}

const Checkbox: React.FC<ICheckboxProps> = (props) => {
  return (
    <SC.CheckboxWrapper className={cx({ "is-checked": props.field.checked })}>
      <SC.HiddenCheckbox
        {...props.field}
        id={props.id}
        type="checkbox"
        name={props.field.name}
        value={props.field.value}
        checked={props.field.checked}
      />
      <SC.Label
        htmlFor={props.id}
        className={cx({ "is-inline": props.inline })}
      >
        {props.field.checked}
        <SC.Square />
        {props.label && <SC.Text>{props.label}</SC.Text>}
      </SC.Label>
    </SC.CheckboxWrapper>
  )
}

Checkbox.defaultProps = {
  inline: false,
}

export default Checkbox
