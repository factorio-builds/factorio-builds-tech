import { useState } from "react"
import cx from "classnames"
import * as SC from "./input.styles"

interface ITextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  name?: string
  value: React.ReactText
  placeholder?: string
  customPrefix?: JSX.Element
  icon?: JSX.Element
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

interface ITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
  customPrefix,
  icon,
  spellCheck,
  readOnly,
  onChange,
  onKeyPress,
  ...restProps
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
      {customPrefix && <SC.Prefix>{customPrefix}</SC.Prefix>}
      {icon}
      <SC.StyledInput
        {...restProps}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        spellCheck={spellCheck}
        readOnly={readOnly}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onFocus={setFocus}
        onBlur={clearFocus}
      />
    </SC.StyledInputWrapper>
  )
}

const Textarea: React.FC<ITextareaProps> = ({ id, name, value, placeholder, spellCheck, readOnly, ...restProps }) => {
  return (
    <SC.StyledTextarea
      {...restProps}
      name={name}
      id={id}
      value={value}
      placeholder={placeholder}
      spellCheck={spellCheck}
      readOnly={readOnly}
      onChange={restProps.onChange}
      onKeyPress={restProps.onKeyPress}
    />
  )
}

export default {
  Text,
  Textarea,
}
