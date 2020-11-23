import React from "react"
import { FieldProps } from "formik"
import * as SC from "./formik-input.styles"

interface IFormikInputProps extends FieldProps {
  id: string
  type: "text" | "textarea"
}

const FormikInput: React.FC<IFormikInputProps> = ({ id, field, type }) => {
  if (type === "textarea") {
    return <SC.StyledTextarea {...field} id={id} />
  }

  return <SC.StyledInput {...field} id={id} />
}

FormikInput.defaultProps = {
  type: "text",
}

export default FormikInput
