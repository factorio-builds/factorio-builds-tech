import * as S from "./error-message.styles"

interface ErrorMessageProps {
  children: React.ReactNode
}

const ErrorMessage: React.FC<ErrorMessageProps> = (props) => {
  return <S.ErrorMessageWrapper>{props.children}</S.ErrorMessageWrapper>
}

export default ErrorMessage
