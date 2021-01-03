import { useState } from "react"
import cx from "classnames"
import * as SC from "./input.styles"

interface ITextProps {
  id: string
  name?: string
  value: React.ReactText
  placeholder?: string
  icon?: JSX.Element
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

interface ITextareaProps {
  id: string
  name?: string
  value: React.ReactText
  placeholder?: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyPress?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

const Text: React.FC<ITextProps> = ({
  id,
  name,
  value,
  placeholder,
  icon,
  onChange,
  onKeyPress,
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
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onFocus={setFocus}
        onBlur={clearFocus}
      />
    </SC.StyledInputWrapper>
  )
}

const Textarea: React.FC<ITextareaProps> = (props) => {
  const { id, name, value, placeholder, ...restProps } = props

  return (
    <SC.StyledTextarea
      name={name}
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={restProps.onChange}
      onKeyPress={restProps.onKeyPress}
    />
  )
}

export default {
  Text,
  Textarea,
}
