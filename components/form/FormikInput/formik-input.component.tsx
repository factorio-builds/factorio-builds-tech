import React from "react"
import { FieldProps, useFormikContext } from "formik"
import Input from "../Input"

interface IFormikInputProps extends FieldProps {
  id: string
  type: "text" | "textarea"
}

const FormikInput: React.FC<IFormikInputProps> = ({ id, field, type }) => {
  const context = useFormikContext()

  if (type === "textarea") {
    return (
      <Input.Textarea
        id={id}
        onChange={(e) => context.setFieldValue(field.name, e.target.value)}
        value={field.value}
      />
    )
  }

  return (
    <Input.Text
      id={id}
      onChange={(e) => context.setFieldValue(field.name, e.target.value)}
      value={field.value}
    />
  )
}

FormikInput.defaultProps = {
  type: "text",
}

export default FormikInput
