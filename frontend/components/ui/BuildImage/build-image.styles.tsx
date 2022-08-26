import { styled } from "../../../design/stitches.config"

export const OuterWrapper = styled("div", {
  position: "relative",
  width: "100%",
  height: 0,
  paddingBottom: "calc((1 / var(--ratio)) * 100%)",
})

export const InnerWrapper = styled("div", {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
})
