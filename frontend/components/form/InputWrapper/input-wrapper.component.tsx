import React from "react"
import cx from "classnames"
import ThumbsUp from "../../../icons/thumbs-up"
import ErrorMessage from "../ErrorMessage"
import * as S from "./input-wrapper.styles"

interface IInputWrapper extends React.ComponentPropsWithoutRef<"div"> {
  uid: string
  label?: string | React.ReactElement
  validFeedback?: string
  error?: any
}

const InputWrapper: React.FC<IInputWrapper> = (props) => {
  const classNames = cx(props.className, {
    "is-error": props.error,
    "is-valid": props.validFeedback && !props.error,
  })

  return (
    <S.StyledInputWrapper className={classNames}>
      {props.label && <S.Label htmlFor={props.uid}>{props.label}</S.Label>}
      {props.children}
      {props.error && <ErrorMessage>{props.error}</ErrorMessage>}
      {props.validFeedback && (
        <S.ValidMessage>
          <ThumbsUp />
          {props.validFeedback}
        </S.ValidMessage>
      )}
    </S.StyledInputWrapper>
  )
}

export default InputWrapper
