import React from "react"
import { FieldProps, useFormikContext } from "formik"
import Checkbox from "../Checkbox/checkbox.component"

interface IFormikCheckboxProps extends FieldProps {
  id: string
  label: string
  prefix: JSX.Element
  inline?: boolean
}

const FormikCheckbox: React.FC<IFormikCheckboxProps> = (props) => {
  const context = useFormikContext()
  const name = props.field.name
  const value = props.field.value
  // @ts-ignore
  const isArray = Array.isArray(context.initialValues[name])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isArray) {
      handleChangeMulti(e)
    } else {
      handleChangeSingle(e)
    }
  }

  const handleChangeSingle = (e: React.ChangeEvent<HTMLInputElement>) => {
    context.setFieldValue(name, e.target.checked)
  }

  const handleChangeMulti = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const formValues = context.values[name] as string[]
    const isChecked = e.target.checked

    if (isChecked) {
      context.setFieldValue(name, [...formValues, value])
    } else {
      context.setFieldValue(
        name,
        formValues.filter((v) => v !== value)
      )
    }
  }

  return (
    <Checkbox
      id={props.id}
      label={props.label}
      prefix={props.prefix}
      value={value}
      checked={Boolean(props.field.checked)}
      onChange={handleChange}
      inline={props.inline}
    />
  )
}

FormikCheckbox.defaultProps = {
  inline: false,
}

export default FormikCheckbox
