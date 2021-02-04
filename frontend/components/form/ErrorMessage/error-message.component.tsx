import * as SC from "./error-message.styles"

const ErrorMessage: React.FC = (props) => {
  return <SC.ErrorMessageWrapper>{props.children}</SC.ErrorMessageWrapper>
}

export default ErrorMessage
