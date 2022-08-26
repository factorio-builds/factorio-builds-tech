import * as S from "./error-message.styles"

const ErrorMessage: React.FC = (props) => {
  return <S.ErrorMessageWrapper>{props.children}</S.ErrorMessageWrapper>
}

export default ErrorMessage
