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

const selfClosingNode = (type: string) => {
  return P.string("[").then(
    P.string(type)
      .chain((type) => {
        return P.string("=")
          .then(P.regex(/[a-z-]+/))
          .map((value) => {
            return {
              type,
              value,
            }
          })
      })
      .skip(P.string("]"))
  )
}

const regularNode = (type: string, node: P.Parser<IParsedRichTextNode>) => {
  return P.seq(
    P.string("[").then(
      P.string(type)
        .chain((type) => {
          return P.string("=")
            .then(P.letters)
            .map((value) => {
              return {
                type,
                value,
              }
            })
        })
        .skip(P.string("]"))
    ),
    P.string("a"),
    // node.many(),
    P.string("[/").then(P.string(type)).skip(P.string("]"))
  ).map((r) => {
    return {
      type,
      value: r[0].value,
      children: r[1],
    }
  })
}

export const RichTextParser = P.createLanguage({
  itemNode: () => selfClosingNode("item"),
  colorNode: (r) => regularNode("color", r.node),
  textNode: () =>
    P.regexp(/[a-z ]+/).map((r) => {
      return {
        type: "text",
        value: r,
      }
    }),
  node: (r) => P.alt(r.itemNode, r.colorNode, r.textNode),
  value: (r) => r.node.many(),
})

RichTextParser.value.parse(
  "[color=yellow]a[/color] ️Power [color=green]b[/color]"
)
