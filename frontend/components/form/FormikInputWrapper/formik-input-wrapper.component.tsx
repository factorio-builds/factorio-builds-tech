import React from "react"
import { useUID } from "react-uid"
import { FieldProps, FormikHandlers } from "formik"
import FormikCheckbox from "../FormikCheckbox"
import FormikInput from "../FormikInput"
import FormikSelect from "../FormikSelect"
import InputWrapper from "../InputWrapper"

interface IFormikInputProps extends FieldProps {
  label: string
  prefix: JSX.Element
  placeholder: string
  type: "text" | "textarea" | "checkbox" | "select"
  size: "small" | "large"
  required?: boolean
  spellCheck?: boolean
  inline?: boolean
  validFeedback?: string
  onChange: FormikHandlers["handleChange"]
  onKeyPress?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
}

const FormikInputWrapper: React.FC<IFormikInputProps> = ({
  prefix,
  field,
  form,
  meta,
  type,
  size,
  onChange,
  onKeyPress,
  ...props
}) => {
  const uid = useUID()

  const isTouched = form.touched[field.name]
  const error = isTouched && form.errors[field.name]

  const formikProps = { field, form, meta }

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
      {(type === "text" || type === "textarea") && (
        <FormikInput
          {...formikProps}
          {...props}
          onChange={onChange}
          onKeyPress={onKeyPress}
          type={type}
          id={uid}
        />
      )}
      {type === "checkbox" && (
        <FormikCheckbox
          {...formikProps}
          {...props}
          prefix={prefix}
          label={props.label}
          id={uid}
        />
      )}
      {type === "select" && (
        <FormikSelect {...formikProps} {...props} id={uid} />
      )}
    </InputWrapper>
  )
}

FormikInputWrapper.defaultProps = {
  type: "text",
  size: "large",
  required: false,
  inline: false,
}

export default FormikInputWrapper
