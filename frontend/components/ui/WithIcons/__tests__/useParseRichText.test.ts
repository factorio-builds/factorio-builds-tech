import { renderHook } from "@testing-library/react-hooks"
import useParseRichText from "../useParseRichText.hook"

describe("useParseRichText", () => {
  it("parses a single icon", () => {
    const { result } = renderHook(() =>
      useParseRichText("[item=stone-furnace]")
    )

    expect(result.current).toEqual([{ type: "item", value: "stone-furnace" }])
  })

  it("parses two icons", () => {
    const { result } = renderHook(() =>
      useParseRichText("[item=stone-furnace][item=transport-belt]")
    )

    expect(result.current).toEqual([
      { type: "item", value: "stone-furnace" },
      { type: "item", value: "transport-belt" },
    ])
  })
})
