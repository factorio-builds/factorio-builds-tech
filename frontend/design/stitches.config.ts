import { createStitches } from "@stitches/react"
import { COLOR } from "./tokens/color"
import { FONT_FAMILY } from "./tokens/typo"

const { styled, getCssText, globalCss, css } = createStitches({
  theme: {
    colors: {
      background: COLOR.BACKGROUND,
      fadedBlue900: COLOR.FADEDBLUE900,
      fadedBlue700: COLOR.FADEDBLUE700,
    },
    fonts: {
      heading: FONT_FAMILY.HEADING,
      body: FONT_FAMILY.BODY,
      mono: FONT_FAMILY.MONO,
    },
    space: {
      0: 0,
      1: "4px",
      2: "8px",
      3: "16px",
      4: "32px",
      5: "64px",
    },
  },
})

export { styled, getCssText, css }

export const globalStyles = globalCss({
  body: {
    background: "$background",
    color: "$fadedBlue900",
    margin: 0,
    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif`,
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
  },

  code: {
    fontFamily: "$mono",
  },

  "body, #__next": {
    minHeight: "100vh",
  },

  "#__next": {
    display: "flex",
    flexDirection: "column",
  },

  ".fresnel-container": {
    width: "100%",
  },

  "p a": {
    fontWeight: 700,
    color: "$fadedBlue700",

    "&:hover, &:focus": {
      color: "$fadedBlue900",
    },
  },
})
