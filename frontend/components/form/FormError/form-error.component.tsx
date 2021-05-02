import { useMemo } from "react"
import { AxiosError } from "axios"
import * as SC from "./form-error.styles"

interface IFormErrorProps {
  error: AxiosError
  message?: string
}

const FormError = (props: IFormErrorProps): JSX.Element => {
  const message = useMemo(() => {
    if (props.message) {
      return `Error: ${props.message}`
    }

    if (props.error.response?.status === 401) {
      return "Error: unauthentified, please log in."
    }

    return "Error: something unexpected happened."
  }, [props.error, props.message])

  return <SC.FormErrorWrapper>{message}</SC.FormErrorWrapper>
}

export default FormError
