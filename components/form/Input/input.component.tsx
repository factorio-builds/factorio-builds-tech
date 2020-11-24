import * as SC from "./input.styles"

interface ITextProps {
  id: string
  value: React.ReactText
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

interface ITextareaProps {
  id: string
  value: React.ReactText
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const Text: React.FC<ITextProps> = ({ id, value, onChange }) => {
  return <SC.StyledInput id={id} value={value} onChange={onChange} />
}

const Textarea: React.FC<ITextareaProps> = ({ id, value, onChange }) => {
  return <SC.StyledTextarea id={id} value={value} onChange={onChange} />
}

export default {
  Text,
  Textarea,
}
