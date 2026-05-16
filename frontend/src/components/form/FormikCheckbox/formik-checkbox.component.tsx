import React from "react"
import { FieldProps, useField, useFormikContext } from "formik"
import Checkbox from "../Checkbox/checkbox.component"

interface IFormikCheckboxProps extends FieldProps {
  id: string
  label: string
  prefix: JSX.Element
  inline?: boolean
}

const FormikCheckbox: React.FC<IFormikCheckboxProps> = (props) => {
  const context = useFormikContext()
  const [field] = useField(props.field.name)
  const name = props.field.name
  const value = props.field.value
  // @ts-ignore
  const isArray = Array.isArray(context.initialValues[name])

  const handleChange = (isChecked: boolean) => {
    if (isArray) {
      handleChangeMulti(isChecked)
    } else {
      handleChangeSingle(isChecked)
    }
    props.form.setFieldTouched(field.name)
  }

  const handleChangeSingle = (isChecked: boolean) => {
    context.setFieldValue(name, isChecked)
  }

  const handleChangeMulti = (isChecked: boolean) => {
    // @ts-ignore
    const formValues = context.values[name] as string[]

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
