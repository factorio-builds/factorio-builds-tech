import React from "react"
import { FieldProps, useField } from "formik"
import Input from "../Input"

interface IFormikInputProps extends FieldProps {
  id: string
  type: "text" | "textarea"
  spellCheck?: boolean
  onKeyPress?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
}

const FormikInput: React.FC<IFormikInputProps> = ({
  id,
  type,
  ...restProps
}) => {
  const [field] = useField(restProps.field.name)

  if (type === "textarea") {
    return (
      <Input.Textarea
        id={id}
        name={field.name}
        onChange={(e) => {
          field.onChange(e)
          restProps.form.setFieldTouched(field.name)
        }}
        onKeyPress={restProps.onKeyPress}
        value={field.value}
        spellCheck={restProps.spellCheck}
      />
    )
  }

  return (
    <Input.Text
      id={id}
      name={field.name}
      onChange={(e) => {
        field.onChange(e)
        restProps.form.setFieldTouched(field.name)
      }}
      onKeyPress={restProps.onKeyPress}
      value={field.value}
      spellCheck={restProps.spellCheck}
    />
  )
}

FormikInput.defaultProps = {
  type: "text",
}

export default FormikInput
