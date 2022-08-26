import React from "react"
import cx from "classnames"
import Stacker from "../../ui/Stacker"
import * as S from "./input-group.styles"

interface IInputGroup {
  legend: string | JSX.Element
  error?: any
}

const InputGroup: React.FC<IInputGroup> = (props) => {
  const classNames = cx({
    "is-error": props.error,
  })

  return (
    <S.StyledInputGroup className={classNames}>
      <Stacker orientation="vertical" gutter={6}>
        <S.Legend>{props.legend}</S.Legend>
        {props.children}
      </Stacker>
    </S.StyledInputGroup>
  )
}

export default InputGroup
