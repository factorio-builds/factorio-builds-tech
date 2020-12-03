import React from "react"
import { FieldProps, FormikHandlers, useField } from "formik"
import Input from "../Input"

interface IFormikInputProps extends FieldProps {
  id: string
  type: "text" | "textarea"
  onChange?: FormikHandlers["handleChange"]
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
        onChange={field.onChange}
        onKeyPress={restProps.onKeyPress}
        value={field.value}
      />
    )
  }

  return (
    <Input.Text
      id={id}
      name={field.name}
      onChange={field.onChange}
      onKeyPress={restProps.onKeyPress}
      value={field.value}
    />
  )
}

FormikInput.defaultProps = {
  type: "text",
}

export default FormikInput
