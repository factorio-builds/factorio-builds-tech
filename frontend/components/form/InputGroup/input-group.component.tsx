import React from "react"
import cx from "classnames"
import * as SC from "./input-group.styles"

interface IInputGroup {
  legend: string | JSX.Element
  error?: any
}

const InputGroup: React.FC<IInputGroup> = (props) => {
  const classNames = cx({
    "is-error": props.error,
  })

  return (
    <SC.StyledInputGroup className={classNames}>
      <SC.Legend>{props.legend}</SC.Legend>
      {props.children}
    </SC.StyledInputGroup>
  )
}

export default InputGroup
