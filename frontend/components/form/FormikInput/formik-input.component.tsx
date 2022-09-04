import React from "react"
import { FieldProps, useField } from "formik"
import dynamic from "next/dynamic"
import Input from "../Input"

const DynamicMarkdownEditor = dynamic(() => import("../MarkdownEditor"), {
  ssr: false,
})

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
      <DynamicMarkdownEditor
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
