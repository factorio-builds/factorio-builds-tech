import { useMemo } from "react"
import { AxiosError } from "axios"
import * as S from "./form-error.styles"

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

  return <S.FormErrorWrapper>{message}</S.FormErrorWrapper>
}

export default FormError
