import React from "react"
import { render } from "@testing-library/react"
import RichText from "../index"

describe("<RichText />", () => {
  it("parses a title with no icons", () => {
    const { getByText } = render(<RichText input="build name" />)

    expect(getByText("build name")).toBeTruthy()
  })

  it("returns a default title when passed an empty string", () => {
    const { getByText } = render(<RichText input="" />)

    expect(getByText("[unnamed]")).toBeTruthy()
  })

  it("renders a prefix", () => {
    const { getByText } = render(
      <RichText prefix={<div>prefix</div>} input="build name" />
    )

    expect(getByText("build name")).toBeTruthy()
    expect(getByText("prefix")).toBeTruthy()
  })

  it("parses a title with item icon", () => {
    const { container, getByText, getAllByTestId } = render(
      <RichText input="[item=transport-belt] build name" />
    )

    const icons = getAllByTestId("item-icon") as HTMLImageElement[]

    expect(icons).toHaveLength(1)
    expect(icons[0].src).toBe(
      "https://api.local.factorio.tech/assets/icon/64/item/transport-belt.png"
    )
    expect(getByText("build name")).toBeTruthy()
    expect(container).toMatchSnapshot()
  })

  it("parses a title with multiple item icons", () => {
    const { container, getByText, getAllByTestId } = render(
      <RichText input="[item=transport-belt] build name [item=fast-transport-belt]" />
    )

    const icons = getAllByTestId("item-icon") as HTMLImageElement[]

    expect(icons).toHaveLength(2)
    expect(icons[0].src).toBe(
      "https://api.local.factorio.tech/assets/icon/64/item/transport-belt.png"
    )
    expect(icons[1].src).toBe(
      "https://api.local.factorio.tech/assets/icon/64/item/fast-transport-belt.png"
    )
    expect(getByText("build name")).toBeTruthy()
    expect(container).toMatchSnapshot()
  })
})
