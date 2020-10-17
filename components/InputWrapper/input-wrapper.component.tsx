import React from "react"
import cx from "classnames"
import * as SC from "./input-wrapper.styles"

interface IInputWrapper {
  uid: string
  label?: string
  error: any
}

const InputWrapper: React.FC<IInputWrapper> = (props) => {
  const classNames = cx({
    "is-error": props.error,
  })

  return (
    <SC.StyledInputWrapper className={classNames}>
      {props.label && <SC.Label htmlFor={props.uid}>{props.label}</SC.Label>}
      {props.children}
      {props.error && <SC.ErrorMessage>{props.error}</SC.ErrorMessage>}
    </SC.StyledInputWrapper>
  )
}

export default InputWrapper
