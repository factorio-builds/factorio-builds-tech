import React from "react"
import { useUID } from "react-uid"
import { FieldProps } from "formik"
import Checkbox from "../Checkbox"
import InputWrapper from "../InputWrapper"
import Select from "../Select"
import * as SC from "./input.styles"

interface IInputProps extends FieldProps {
  label: string
  placeholder: string
  type: "text" | "textarea" | "checkbox" | "select"
  required?: boolean
  inline?: boolean
}

const Input: React.FC<IInputProps> = ({ field, form, type, ...props }) => {
  const uid = useUID()

  const isTouched = form.touched[field.name]
  const error = isTouched && form.errors[field.name]

  return (
    <InputWrapper
      {...props}
      label={
        !props.inline && type !== "checkbox"
          ? // todo: extract/cleanup logic
            `${props.label} ${!props.required ? "(optional)" : ""}`.trim()
          : undefined
      }
      error={error}
      uid={uid}
    >
      {type === "text" && <SC.StyledInput {...field} id={uid} />}
      {type === "textarea" && <SC.StyledTextarea {...field} id={uid} />}
      {type === "checkbox" && (
        <Checkbox
          {...props}
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
  required: false,
  inline: false,
}

export default Input
