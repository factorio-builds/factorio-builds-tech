interface IParsedRichTextNode<T = "item" | "text"> {
  type: T
  value: string
}

function parseItem(
  text: string
): { text: IParsedRichTextNode<"item"> | null; rest: string } {
  const itemRegex = new RegExp(/(\[(item)=([a-z-]+)\])/)
  const result = text.match(itemRegex)

  if (!result) {
    return { text: null, rest: text }
  }

  if (result[2] === "item" && result[3]) {
    const rest = text.replace(result[1], "")
    return { text: { type: "item", value: result[3] }, rest }
  }

  return { text: null, rest: text }
}

function useParseRichText(text: string): IParsedRichTextNode[] {
  const parts: IParsedRichTextNode[] = []
  let rest = ""

  const initialParse = parseItem(text)

  if (!initialParse.text) {
    return []
  }

  parts.push(initialParse.text)
  rest = initialParse.rest

  while (rest !== "") {
    const parse = parseItem(rest)

    if (parse.text) {
      parts.push(parse.text)
    }

    rest = parse.rest
  }

  return parts
}

export default useParseRichText
