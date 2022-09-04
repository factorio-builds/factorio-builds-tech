import React from "react"
import SimpleMDE from "react-simplemde-editor"
import "easymde/dist/easymde.min.css"
import * as S from "./markdown-editor.styles"

interface IMarkdownEditorProps {
  id: string
  name?: string
  value: string
  onChange: (value: string) => void
}

const MarkdownEditor = ({
  value,
  onChange,
}: IMarkdownEditorProps): JSX.Element => {
  const options = React.useMemo<EasyMDE.Options>(() => {
    return {
      spellChecker: false,
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "code",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "|",
        "preview",
        "|",
        "guide",
      ],
    }
  }, [])

  return (
    <S.StyledMarkdownEditor>
      <SimpleMDE value={value} onChange={onChange} options={options} />
    </S.StyledMarkdownEditor>
  )
}

export default MarkdownEditor
