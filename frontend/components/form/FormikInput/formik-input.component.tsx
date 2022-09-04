import React from "react"
import { FieldProps, useField } from "formik"
import Input from "../Input"
import MarkdownEditor from "../MarkdownEditor"

interface IFormikInputProps extends FieldProps {
  id: string
  type: "text" | "textarea" | "markdown"
  spellCheck?: boolean
  readOnly?: boolean
  onKeyPress?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  prefix?: JSX.Element
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
        readOnly={restProps.readOnly}
      />
    )
  }

  if (type === "markdown") {
    return (
      <MarkdownEditor
        id={id}
        name={field.name}
        value={field.value}
        onChange={(value) => {
          field.onChange(value)
          restProps.form.setFieldTouched(field.name)
        }}
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
      readOnly={restProps.readOnly}
      customPrefix={restProps.prefix}
    />
  )
}

FormikInput.defaultProps = {
  type: "text",
}

export default FormikInput
