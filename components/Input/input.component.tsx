import React from "react"
import { useUID } from "react-uid"
import { FieldProps } from "formik"
import Checkbox from "../Checkbox"
import InputWrapper from "../InputWrapper"
import Select from "../Select"
import * as SC from "./input.styles"

interface IInputProps extends FieldProps {
  label: string
  prefix: JSX.Element
  placeholder: string
  type: "text" | "textarea" | "checkbox" | "select"
  size: "small" | "large"
  required?: boolean
  inline?: boolean
  validFeedback?: string
}

const Input: React.FC<IInputProps> = ({
  prefix,
  field,
  form,
  type,
  size,
  ...props
}) => {
  const uid = useUID()

  const isTouched = form.touched[field.name]
  const error = isTouched && form.errors[field.name]

  return (
    <InputWrapper
      {...props}
      className={`size-${size}`}
      label={
        !props.inline && type !== "checkbox"
          ? // todo: extract/cleanup logic
            `${props.label} ${!props.required ? "(optional)" : ""}`.trim()
          : undefined
      }
      error={error}
      validFeedback={isTouched && !error ? props.validFeedback : undefined}
      uid={uid}
    >
      {type === "text" && <SC.StyledInput {...field} id={uid} />}
      {type === "textarea" && <SC.StyledTextarea {...field} id={uid} />}
      {type === "checkbox" && (
        <Checkbox
          {...props}
          prefix={prefix}
          label={props.label}
          form={form}
          field={field}
          meta={props.meta}
          id={uid}
        />
      )}
      {type === "select" && (
        <Select {...props} form={form} field={field} id={uid} />
      )}
    </InputWrapper>
  )
}

Input.defaultProps = {
  type: "text",
  size: "large",
  required: false,
  inline: false,
}

export default Input
