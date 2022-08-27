import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"

export const Square = styled("div", {
  position: "relative",
  boxSizing: "border-box",
  background: "$input",
  width: "18px",
  height: "18px",
  border: "2px solid $fadedBlue500",
  borderRadius: "6px",

  "&::after": {
    content: "",
    position: "absolute",
    top: "3px",
    left: "3px",
    right: "3px",
    bottom: "3px",
    background: "transparent",
    borderRadius: "3px",
  },
})

export const Label = styled("label", getTypo(ETypo.FORM_LABEL), {
  display: "flex",
  flexGrow: 1,
  alignItems: "center",
  cursor: "pointer",
  padding: "3px",

  "&.is-inline": {
    fontWeight: 400,
  },
})

export const CheckboxWrapper = styled("div", {
  display: "flex",
  margin: "0 -3px",
  borderRadius: "8px",

  "&:hover": {
    background: "linear-gradient(90deg, #2b4564 0%, #333642 100%)",
  },

  [`&:hover ${Square}`]: {
    borderColor: "#6b98ce",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
  },

  [`&:focus-within ${Square}`]: {
    boxShadow: "0 0 0 3px $colors$focused",
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
  fontSize: "14px",
  fontWeight: 400,
  display: "flex",
  alignItems: "center",
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
