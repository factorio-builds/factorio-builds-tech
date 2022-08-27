import React from "react"
import * as S from "./input.styles"

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

interface ITextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
  const inputRef = React.useRef<HTMLInputElement>(null)

  function focus(): void {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <S.StyledInputWrapper onClick={focus}>
      {customPrefix && <S.Prefix>{customPrefix}</S.Prefix>}
      {icon}
      <S.StyledInput
        {...restProps}
        ref={inputRef}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        spellCheck={spellCheck}
        readOnly={readOnly}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
    </S.StyledInputWrapper>
  )
}

const Textarea: React.FC<ITextareaProps> = ({
  id,
  name,
  value,
  placeholder,
  spellCheck,
  readOnly,
  ...restProps
}) => {
  return (
    <S.StyledTextarea
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
