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

function parseItem(
  text: string
): { part: IParsedRichTextNodeItem | null; rest: string } {
  const itemRegex = new RegExp(/(\[(item)=([a-z-]+)\])/)
  const result = text.match(itemRegex)

  if (!result) {
    return { part: null, rest: text }
  }

  if (result[2] === "item" && result[3]) {
    const rest = text.replace(result[1], "")
    return { part: { type: "item", value: result[3] }, rest }
  }

  return { part: null, rest: text }
}

function parseText(
  text: string
): { part: IParsedRichTextNodeText | null; rest: string } {
  // TODO: smarter regex to match value by type: https://wiki.factorio.com/Rich_text
  const regex = new RegExp(/(\[((item)|(color))=(.+?)\])/)
  const result = text.match(regex)

  if (!result && text) {
    return { part: { type: "text", value: text }, rest: "" }
  }

  if (!result) {
    return { part: null, rest: text }
  }

  const index = text.indexOf(result[1])

  const rest = text.slice(index)
  const value = text.replace(rest, "")

  return { part: { type: "text", value: value }, rest }
}

function parseColor(
  text: string
): { part: IParsedRichTextNodeColor | null; rest: string } {
  // TODO: smarter regex to match different kind of colors: https://wiki.factorio.com/Rich_text
  const colorRegex = new RegExp(/(\[(color)=(.+?)\](.+?)\[\/color\])/)
  const result = text.match(colorRegex)

  if (!result) {
    return { part: null, rest: text }
  }

  const rest = text.replace(result[1], "")

  const children = resursiveParse(result[4])

  return {
    part: {
      type: "color",
      value: result[3].trim(),
      children,
    },
    rest: rest,
  }
}

function parse(text: string) {
  if (text.startsWith("[item")) {
    return parseItem(text)
  }

  if (text.startsWith("[color")) {
    return parseColor(text)
  }

  return parseText(text)
}

function resursiveParse(text: string): IParsedRichTextNode[] {
  const parts: IParsedRichTextNode[] = []
  let rest = ""

  const initialParse = parse(text)

  if (!initialParse.part) {
    return []
  }

  parts.push(initialParse.part)
  rest = initialParse.rest

  while (rest !== "") {
    const parsed = parse(rest)

    if (parsed.part) {
      parts.push(parsed.part)
    }

    rest = parsed.rest
  }

  return parts
}

function useParseRichText(text?: string): IParsedRichTextNode[] {
  if (!text) {
    return []
  }

  return resursiveParse(text)
}

export default useParseRichText
