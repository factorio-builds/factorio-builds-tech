import { styled } from "../../../design/stitches.config"

export const RichTextWrapper = styled("span", {
  display: "inline-block",

  "&::after": {
    content: "",
    clear: "both",
    display: "table",
  },

  "> :first-child": {
    marginLeft: 0,
  },

  "> :last-child": {
    marginRight: 0,
  },

  img: {
    float: "left",
    width: "auto",
    height: "1em",
    margin: "0 0.25em",
  },
})
