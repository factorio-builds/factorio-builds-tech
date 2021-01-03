import React from "react"
import cx from "classnames"
import ThumbsUp from "../../../icons/thumbs-up"
import * as SC from "./input-wrapper.styles"

interface IInputWrapper extends React.ComponentPropsWithoutRef<"div"> {
  uid: string
  label?: string
  validFeedback?: string
  error: any
}

const InputWrapper: React.FC<IInputWrapper> = (props) => {
  const classNames = cx(props.className, {
    "is-error": props.error,
    "is-valid": props.validFeedback && !props.error,
  })

  return (
    <SC.StyledInputWrapper className={classNames}>
      {props.label && <SC.Label htmlFor={props.uid}>{props.label}</SC.Label>}
      {props.children}
      {props.error && <SC.ErrorMessage>{props.error}</SC.ErrorMessage>}
      {props.validFeedback && (
        <SC.ValidMessage>
          <ThumbsUp />
          {props.validFeedback}
        </SC.ValidMessage>
      )}
    </SC.StyledInputWrapper>
  )
}

export default InputWrapper
