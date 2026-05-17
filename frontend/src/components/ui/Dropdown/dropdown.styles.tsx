import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"
import Stacker from "../Stacker"

export const MenuTrigger = styled("button", getTypo(ETypo.BUTTON), {
  display: "flex",
  alignItems: "center",
  background: "linear-gradient(180deg, #333742, #272b33)",
  color: "$fadedBlue900",
  height: "38px",
  padding: "0 11px 0 9px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",

  "&:hover": {
    background: "linear-gradient(180deg, #2f323a, #23262b)",
  },

  "svg path": {
    fill: "$fadedBlue500",
  },
})

export const InnerMenuTrigger = styled(Stacker, {
  display: "flex",
  alignItems: "center",
})

export const StyledMenuButton = styled("div", {
  position: "relative",
  display: "inline-block",
})

export const StyledMenuPopup = styled("ul", {
  boxSizing: "border-box",
  listStyle: "none",
  minWidth: "100%",
  position: "absolute",
  right: 0,
  borderRadius: "5px",
  margin: "4px 0 0 0",
  border: "1px solid #454854",
  padding: "6px 0",
  background: "$header",
  overflow: "hidden",
})

export const StyledMenuItem = styled("li", {
  color: "$fadedBlue900",
  padding: "6px 9px",
  outline: "none",
  cursor: "pointer",
  textAlign: "right",

  "&:hover, &.is-focused": {
    background: "linear-gradient(180deg, #333742, #272b33)",
  },
})
