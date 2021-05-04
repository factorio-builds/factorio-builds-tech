import { RichTextParser } from "../rich-text"

describe("rich text util", () => {
  it("parses text", () => {
    expect(RichTextParser.value.parse("hi")).toEqual({
      status: true,
      value: [{ type: "text", value: "hi" }],
    })
  })

  it("parses multiple words as one text node", () => {
    expect(RichTextParser.value.parse("bonjour hi")).toEqual({
      status: true,
      value: [{ type: "text", value: "bonjour hi" }],
    })
  })

  it("parses text + item", () => {
    expect(RichTextParser.value.parse("hi[item=rail]")).toEqual({
      status: true,
      value: [
        { type: "text", value: "hi" },
        { type: "item", value: "rail" },
      ],
    })
  })

  it("parses item + text", () => {
    expect(RichTextParser.value.parse("[item=rail]hi")).toEqual({
      status: true,
      value: [
        { type: "item", value: "rail" },
        { type: "text", value: "hi" },
      ],
    })
  })

  it("parses text + color", () => {
    expect(RichTextParser.value.parse("hi[color=red]content[/color]")).toEqual({
      status: true,
      value: [
        { type: "text", value: "hi" },
        {
          type: "color",
          value: "red",
          children: [{ type: "text", value: "content" }],
        },
      ],
    })
  })
})
