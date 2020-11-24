import React from "react"
import cx from "classnames"
import { FieldProps } from "formik"
import * as SC from "./formik-checkbox.styles"

interface IFormikCheckboxProps extends FieldProps {
  id: string
  label: string
  prefix: JSX.Element
  text?: string
  inline?: boolean
}

const FormikCheckbox: React.FC<IFormikCheckboxProps> = (props) => {
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
        {props.label && (
          <SC.Text>
            {props.prefix && <SC.Prefix>{props.prefix}</SC.Prefix>}
            {props.label}
          </SC.Text>
        )}
      </SC.Label>
    </SC.CheckboxWrapper>
  )
}

FormikCheckbox.defaultProps = {
  inline: false,
}

export default FormikCheckbox
