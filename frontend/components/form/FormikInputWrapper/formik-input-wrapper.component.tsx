import React from "react"
import { FieldProps } from "formik"
import FormikCheckbox from "../FormikCheckbox"
import FormikInput from "../FormikInput"
import FormikSelect from "../FormikSelect"
import InputWrapper from "../InputWrapper"

interface IFormikInputProps extends FieldProps {
  label: string
  prefix: JSX.Element
  placeholder: string
  type: "text" | "textarea" | "markdown" | "checkbox" | "select"
  size: "small" | "large"
  required?: boolean
  spellCheck?: boolean
  readOnly?: boolean
  inline?: boolean
  validFeedback?: string
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
  onKeyPress,
  ...props
}) => {
  const uid = React.useId()

  const isTouched = form.touched[field.name]
  const error = isTouched && form.errors[field.name]

  const formikProps = { field, form, meta }

  return (
    <InputWrapper
      {...props}
      className={`size-${size}`}
      label={
        // TODO: clean up logic
        !props.inline && type !== "checkbox" ? (
          <>
            {props.label} {!props.required && <span>(optional)</span>}
          </>
        ) : undefined
      }
      error={type !== "checkbox" && error}
      validFeedback={isTouched && !error ? props.validFeedback : undefined}
      uid={uid}
    >
      {(type === "text" || type === "textarea" || type === "markdown") && (
        <FormikInput
          {...props}
          {...formikProps}
          prefix={prefix}
          onKeyPress={onKeyPress}
          type={type}
          id={uid}
        />
      )}
      {type === "checkbox" && (
        <FormikCheckbox
          {...props}
          {...formikProps}
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
