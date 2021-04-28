import { renderHook } from "@testing-library/react-hooks"
import useParseRichText from "../useParseRichText.hook"

describe("useParseRichText", () => {
  it("parses a string", () => {
    const { result } = renderHook(() => useParseRichText("simple string"))

    expect(result.current).toEqual([{ type: "text", value: "simple string" }])
  })

  it("parses a single icon", () => {
    const { result } = renderHook(() => useParseRichText("[item=stone-furnace]"))

    expect(result.current).toEqual([{ type: "item", value: "stone-furnace" }])
  })

  it("parses two icons", () => {
    const { result } = renderHook(() => useParseRichText("[item=stone-furnace][item=transport-belt]"))

    expect(result.current).toEqual([
      { type: "item", value: "stone-furnace" },
      { type: "item", value: "transport-belt" },
    ])
  })

  it("parses a string + icon", () => {
    const { result } = renderHook(() => useParseRichText("some text [item=stone-furnace]"))

    expect(result.current).toEqual([
      { type: "text", value: "some text" },
      { type: "item", value: "stone-furnace" },
    ])
  })

  it("parses an icon + string", () => {
    const { result } = renderHook(() => useParseRichText("[item=stone-furnace] some text"))

    expect(result.current).toEqual([
      { type: "item", value: "stone-furnace" },
      { type: "text", value: "some text" },
    ])
  })

  it("parses an icon + string + icon", () => {
    const { result } = renderHook(() => useParseRichText("[item=stone-furnace] some text [item=fast-inserter]"))

    expect(result.current).toEqual([
      { type: "item", value: "stone-furnace" },
      { type: "text", value: "some text" },
      { type: "item", value: "fast-inserter" },
    ])
  })

  it("parses a text + icon + text", () => {
    const { result } = renderHook(() => useParseRichText("some text [item=stone-furnace] more text"))

    expect(result.current).toEqual([
      { type: "text", value: "some text" },
      { type: "item", value: "stone-furnace" },
      { type: "text", value: "more text" },
    ])
  })

  it("parses an empty string", () => {
    const { result } = renderHook(() => useParseRichText(""))

    expect(result.current).toEqual([])
  })

  it("parses an undefined value", () => {
    const { result } = renderHook(() => useParseRichText(undefined))

    expect(result.current).toEqual([])
  })
})
