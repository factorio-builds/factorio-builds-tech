import { useState } from "react"
import cx from "classnames"
import * as SC from "./input.styles"

interface ITextProps {
  id: string
  value: React.ReactText
  placeholder?: string
  icon?: JSX.Element
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

interface ITextareaProps {
  id: string
  value: React.ReactText
  placeholder?: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const Text: React.FC<ITextProps> = ({
  id,
  value,
  placeholder,
  icon,
  onChange,
}) => {
  const [focused, setFocused] = useState(false)

  function setFocus(): void {
    setFocused(true)
  }

  function clearFocus(): void {
    setFocused(false)
  }

  return (
    <SC.StyledInputWrapper className={cx({ "is-focused": focused })}>
      {icon}
      <SC.StyledInput
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={setFocus}
        onBlur={clearFocus}
      />
    </SC.StyledInputWrapper>
  )
}

const Textarea: React.FC<ITextareaProps> = ({
  id,
  value,
  placeholder,
  onChange,
}) => {
  return (
    <SC.StyledTextarea
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  )
}

export default {
  Text,
  Textarea,
}
