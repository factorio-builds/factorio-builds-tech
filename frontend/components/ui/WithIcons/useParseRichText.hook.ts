interface IParsedRichTextNode<T = "item" | "text"> {
  type: T
  value: string
}

function parseItem(
  text: string
): { part: IParsedRichTextNode<"item"> | null; rest: string } {
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
): { part: IParsedRichTextNode<"text"> | null; rest: string } {
  const itemRegex = new RegExp(/(\[(item)=([a-z-]+)\])/)
  const result = text.match(itemRegex)

  if (!result && text) {
    return { part: { type: "text", value: text.trim() }, rest: "" }
  }

  if (!result) {
    return { part: null, rest: text }
  }

  const index = text.indexOf(result[1])

  const rest = text.slice(index)
  const value = text.replace(rest, "")

  return { part: { type: "text", value: value.trim() }, rest }
}

function useParseRichText(text: string): IParsedRichTextNode[] {
  const parts: IParsedRichTextNode[] = []
  let rest = ""

  const initialParse = text.startsWith("[") ? parseItem(text) : parseText(text)

  if (!initialParse.part) {
    return []
  }

  parts.push(initialParse.part)
  rest = initialParse.rest

  while (rest !== "") {
    const parse = rest.startsWith("[") ? parseItem(rest) : parseText(rest)

    if (parse.part) {
      parts.push(parse.part)
    }

    rest = parse.rest
  }

  return parts
}

export default useParseRichText
