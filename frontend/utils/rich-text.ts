import P from "parsimmon"

interface IParsedRichTextNodeItem {
  type: "item"
  value: string
}

interface IParsedRichTextNodeText {
  type: "text"
  value: string
}

interface IParsedRichTextNodeColor {
  type: "color"
  value: string
  children: IParsedRichTextNode[]
}

export type IParsedRichTextNode =
  | IParsedRichTextNodeItem
  | IParsedRichTextNodeText
  | IParsedRichTextNodeColor

function mergeText(nodes: IParsedRichTextNode[]): IParsedRichTextNode[] {
  const result: IParsedRichTextNode[] = []
  for (const node of nodes) {
    const last = result[result.length - 1]
    if (node.type === "text" && last?.type === "text") {
      result[result.length - 1] = {
        type: "text",
        value: last.value + node.value,
      }
    } else {
      result.push(node)
    }
  }
  return result
}

interface IRichTextLanguage {
  item: IParsedRichTextNodeItem
  color: IParsedRichTextNodeColor
  text: IParsedRichTextNodeText
  brokenBracket: IParsedRichTextNodeText
  node: IParsedRichTextNode
  value: IParsedRichTextNode[]
}

export const RichTextParser = P.createLanguage<IRichTextLanguage>({
  item: () =>
    P.seqMap(
      P.string("[item="),
      P.regex(/[a-z0-9-]+/),
      P.string("]"),
      (_open, value): IParsedRichTextNodeItem => ({ type: "item", value })
    ),

  color: (r) =>
    P.seqMap(
      P.string("[color="),
      P.regex(/[^\]]+/),
      P.string("]"),
      r.node.many().map(mergeText),
      P.string("[/color]"),
      (_open, value, _close, children): IParsedRichTextNodeColor => ({
        type: "color",
        value,
        children,
      })
    ),

  text: () =>
    P.regex(/[^[]+/).map(
      (value): IParsedRichTextNodeText => ({ type: "text", value })
    ),

  // A literal `[` that doesn't open a valid tag. Without this, dangling
  // tags like `[color=red]` with no closing `[/color]` (issue #603) leave
  // the parser unable to advance and the whole parse fails. The
  // notFollowedBy guard keeps us from swallowing a real `[/color]` close
  // while parsing color children.
  brokenBracket: () =>
    P.string("[")
      .notFollowedBy(P.string("/color]"))
      .map((): IParsedRichTextNodeText => ({ type: "text", value: "[" })),

  node: (r) => P.alt(r.item, r.color, r.text, r.brokenBracket),

  value: (r) => r.node.many().map(mergeText),
})
