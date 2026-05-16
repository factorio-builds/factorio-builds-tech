import { styled } from "../../../design/stitches.config"

export const TooltipWrapper = styled("div", {
  display: "inline-flex",
  position: "relative",
  cursor: "help",
  borderBottom: "1px dashed rgba(255, 255, 255, 0.3)",
  whiteSpace: "nowrap",
})

export const TooltipContent = styled("div", {
  opacity: 0,
  position: "absolute",
  left: 0,
  top: "100%",
  marginTop: "-10px",
  transition: "all 0.15s",
  pointerEvents: "none",
  background: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(7px)",
  padding: "7px",
  borderRadius: "5px",
  width: "max-content",
  maxWidth: "400px",

  [`${TooltipWrapper}:hover &`]: {
    opacity: 1,
    marginTop: "5px",
  },
})
