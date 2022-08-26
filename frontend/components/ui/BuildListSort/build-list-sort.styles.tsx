import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"

export const BuildListSortWrapper = styled("div", getTypo(ETypo.BODY), {
  fontSize: "16px",
  display: "flex",
  color: "$fadedBlue700",
  textAlign: "right",
})

export const SortDropdownWapper = styled("div", {
  position: "relative",
  marginLeft: "4px",
})

export const DropdownTrigger = styled("div", {
  fontWeight: 700,
  cursor: "pointer",
})

export const DropdownMenu = styled("div", {
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  background: "#333642",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.25)",
  position: "absolute",
  top: "100%",
  left: "-8px",
  right: "-8px",
  zIndex: 1,
  marginTop: "5px",
  borderRadius: "4px",
  minWidth: "fit-content",
})

export const DropdownItem = styled("button", {
  background: "transparent",
  border: 0,
  color: "$fadedBlue900",
  whiteSpace: "nowrap",
  padding: "4px 10px",
  cursor: "pointer",
  textAlign: "left",
  minWidth: "fit-content",
  boxSizing: "border-box",

  "&:hover, &.is-selected": {
    background: "rgba(0, 0, 0, 0.2)",
  },
})
