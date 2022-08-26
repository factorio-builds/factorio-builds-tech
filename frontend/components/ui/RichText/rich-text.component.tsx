import React from "react"
import ItemIcon from "../ItemIcon"
import * as S from "./rich-text.styles"
import useParseRichText, { IParsedRichTextNode } from "./useParseRichText.hook"

interface IRichText {
  input: string
  prefix?: JSX.Element
}

interface IRichTextNodeProps {
  node: IParsedRichTextNode
  index: number
}

function RichTextNode({ node, index }: IRichTextNodeProps): JSX.Element {
  if (node.type === "text") {
    return <span key={index}>{node.value}</span>
  }

  if (node.type === "item") {
    return <ItemIcon key={index} type="item" name={node.value} />
  }

  return (
    <span style={{ color: node.value }}>
      {node.children.map((child, i) => {
        return <RichTextNode key={i} index={i} node={child} />
      })}
    </span>
  )
}

function RichText(props: IRichText): JSX.Element {
  const parts = useParseRichText(props.input)

  const formatted = React.useMemo(() => {
    if (!props.input) {
      return "[unnamed]"
    }

    return parts.map((part, index) => {
      return <RichTextNode key={index} node={part} index={index} />
    })
  }, [props.input])

  return (
    <S.RichTextWrapper>
      {props.prefix} {formatted}
    </S.RichTextWrapper>
  )
}

export default RichText
