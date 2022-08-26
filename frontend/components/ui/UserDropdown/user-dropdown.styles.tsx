import { styled } from "../../../design/stitches.config"

export const InnerLink = styled("div", {
  display: "inline-block",
  cursor: "pointer",
  color: "$fadedBlue900",
  textDecoration: "none",
})

export const InnerLinkLogOff = styled(InnerLink, {
  color: "$danger",
})
