import { renderHook } from "@testing-library/react-hooks"
import useParseRichText from "../useParseRichText.hook"

function setupHook(input: string) {
  return renderHook(() => useParseRichText(input))
}

describe("useParseRichText", () => {
  it("parses a string", () => {
    const { result } = setupHook("simple string")

    expect(result.current).toEqual([{ type: "text", value: "simple string" }])
  })

  it("parses an unicode character", () => {
    const { result } = setupHook("☢")

    expect(result.current).toEqual([{ type: "text", value: "☢" }])
  })

  it("parses a single icon", () => {
    const { result } = setupHook("[item=stone-furnace]")

    expect(result.current).toEqual([{ type: "item", value: "stone-furnace" }])
  })

  it("parses two icons", () => {
    const { result } = setupHook("[item=stone-furnace][item=transport-belt]")

    expect(result.current).toEqual([
      { type: "item", value: "stone-furnace" },
      { type: "item", value: "transport-belt" },
    ])
  })

  it("parses a string + icon", () => {
    const { result } = setupHook("some text [item=stone-furnace]")

    expect(result.current).toEqual([
      { type: "text", value: "some text " },
      { type: "item", value: "stone-furnace" },
    ])
  })

  it("parses an unicode character + icon", () => {
    const { result } = setupHook("☢ [item=stone-furnace]")

    expect(result.current).toEqual([
      { type: "text", value: "☢ " },
      { type: "item", value: "stone-furnace" },
    ])
  })

  it("parses an icon + string", () => {
    const { result } = setupHook("[item=stone-furnace] some text")

    expect(result.current).toEqual([
      { type: "item", value: "stone-furnace" },
      { type: "text", value: " some text" },
    ])
  })

  it("parses an icon + string + icon", () => {
    const { result } = setupHook(
      "[item=stone-furnace] some text [item=fast-inserter]"
    )

    expect(result.current).toEqual([
      { type: "item", value: "stone-furnace" },
      { type: "text", value: " some text " },
      { type: "item", value: "fast-inserter" },
    ])
  })

  it("parses a text + icon + text", () => {
    const { result } = setupHook("some text [item=stone-furnace] more text")

    expect(result.current).toEqual([
      { type: "text", value: "some text " },
      { type: "item", value: "stone-furnace" },
      { type: "text", value: " more text" },
    ])
  })

  it("parses an empty string", () => {
    const { result } = setupHook("")

    expect(result.current).toEqual([])
  })

  it("parses an undefined value", () => {
    const { result } = renderHook(() => useParseRichText(undefined))

    expect(result.current).toEqual([])
  })

  it("parses a string inside a color", () => {
    const { result } = setupHook("[color=red]some text[/color]")

    expect(result.current).toEqual([
      {
        type: "color",
        value: "red",
        children: [{ type: "text", value: "some text" }],
      },
    ])
  })

  it("parses a string inside a color + text", () => {
    const { result } = setupHook("[color=red]some text[/color] more text")

    expect(result.current).toEqual([
      {
        type: "color",
        value: "red",
        children: [{ type: "text", value: "some text" }],
      },
      { type: "text", value: " more text" },
    ])
  })

  it.only("xxx", () => {
    const { result } = setupHook("[color=yellow]a[/color] ️Power")

    expect(result.current).toEqual([
      {
        type: "color",
        value: "yellow",
        children: [{ type: "text", value: "a" }],
      },
      { type: "text", value: " Power" },
    ])
  })

  it("parses a string inside a color, with multiple colors", () => {
    const { result } = setupHook(
      "[color=yellow]a[/color] ️Power [color=green]b[/color]"
    )

    expect(result.current).toEqual([
      {
        type: "color",
        value: "yellow",
        children: [{ type: "text", value: "a" }],
      },
      { type: "text", value: " ️Power " },
      {
        type: "color",
        value: "green",
        children: [{ type: "text", value: "b" }],
      },
    ])
  })

  it.skip("passes sanity test: does not crash or infinite loop", () => {
    setupHook(
      "[item=big-electric-pole][color=175,238,238]Poles[/color][item=big-electric-pole]"
    )
    setupHook(
      "[item=steam-engine][color=169,169,169] Steam[/color] [color=yellow][item=steam-engine] ☀ Solar ☀[/color] [color=green]☢ Nuclear ☢[/color]"
    )
    setupHook(
      "[item=steam-engine][color=169,169,169] Steam[/color] [color=yellow][item=steam-engine] ☀ Solar ☀[/color]"
    )
    setupHook("[item=steam-engine][color=169,169,169] Steam[/color]")
    setupHook(
      "[item=steam-engine] [color=169,169,169]Early Game - Steam[/color] [item=steam-engine]"
    )
    setupHook("[color=yellow]☀ Mid Game - Solar Power ☀[/color]")
    setupHook("[color=255,255,102]☀️ Small - 6.2 MW Solar Farm ☀[/color]")
    setupHook("[color=255,255,0]☀️ Medium - 12 MW Solar Farm ☀☀[/color]")
    setupHook("[color=153,153,0]☀️ Large - 45.4 MW Solar Farm ☀☀☀[/color]")
    setupHook("[color=green]☢ Late Game - Nuclear ☢[/color]")
    setupHook(
      "[item=uranium-fuel-cell][color=0,100,0] Uranium Processing[/color] [item=uranium-fuel-cell]"
    )
    setupHook("[color=34,139,34]☢ Small - 450 MW Nuclear ☢[/color]")
    setupHook("[color=34,139,34]☢ Small - 450 MW Circle ☢[/color]")
    setupHook("[color=0,206,209]Pipes ☢️[/color]")
    setupHook("6 Pumps ☢")
    setupHook(
      "[entity=character] [color=255,0,255]Extras[/color] [entity=character]"
    )
    setupHook("[entity=character] Tiles [entity=character]")
    setupHook(
      "[item=used-up-uranium-fuel-cell] Fuel Low Alert | Mario [item=used-up-uranium-fuel-cell]"
    )
  })
})
