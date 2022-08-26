import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"

export const Square = styled("div", {
  position: "relative",
  boxSizing: "border-box",
  background: "$input",
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  border: "2px solid $fadedBlue500",

  "&::after": {
    content: "",
    position: "absolute",
    top: "3px",
    left: "3px",
    right: "3px",
    bottom: "3px",
    borderRadius: "50%",
    background: "transparent",
  },
})

export const HiddenRadio = styled("input", {
  display: "none",
})

export const Label = styled("label", getTypo(ETypo.FORM_LABEL), {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",

  "&.is-inline": {
    fontWeight: 400,
  },
})

export const RadioWrapper = styled("div", {
  display: "flex",

  [`&:hover ${Square}`]: {
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
  },

  [`&:hover ${Square}::after`]: {
    background: "$fadedBlue500",
  },

  [`&:focus-within ${Square}`]: {
    boxShadow: "0 0 0 3px $focused",
    outline: "none",
  },

  [`&.is-checked ${Square}::after`]: {
    background: "$selected",
  },

  [`.is-error ${Square}`]: {
    borderColor: "$danger !important",
  },
})

export const Text = styled("div", getTypo(ETypo.FORM_LABEL), {
  display: "flex",
  alignitems: "center",
  marginLeft: "12px",
})

export const Prefix = styled("div", {
  display: "flex",
  width: "24px",
  marginRight: "12px",

  "& img, & svg": {
    width: "100%",
  },
})
