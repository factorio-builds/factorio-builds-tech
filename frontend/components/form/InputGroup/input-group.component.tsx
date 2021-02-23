import React from "react"
import cx from "classnames"
import Stacker from "../../ui/Stacker"
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
      <Stacker orientation="vertical" gutter={6}>
        <SC.Legend>{props.legend}</SC.Legend>
        {props.children}
      </Stacker>
    </SC.StyledInputGroup>
  )
}

export default InputGroup
