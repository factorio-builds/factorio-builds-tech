import { useMemo } from "react"
import { IParsedRichTextNode, RichTextParser } from "../../../utils/rich-text"

function useParseRichText(text?: string): IParsedRichTextNode[] {
  return useMemo(() => {
    if (!text) {
      return []
    }

    const parsed = RichTextParser.value.parse(text)
    if (parsed.status) {
      return parsed.value
    } else {
      console.log("===")
      console.log(text)
      console.log(parsed)
    }
    return [{ type: "text", value: text }]
  }, [text])
}

export default useParseRichText
