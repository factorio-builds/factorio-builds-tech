import { Link as TSLink } from "@tanstack/react-router"
import { styled } from "../../../design/stitches.config"
import Stacker from "../Stacker"

export const LinksWrapper = styled(Stacker, {
  alignItems: "flex-start",
})

const styledLinkStyles = {
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  color: "$fadedBlue700",
  fontWeight: 700,
  textDecoration: "none",

  "&:hover": {
    textDecoration: "underline",
  },

  svg: {
    marginRight: "8px",
    width: "16px",
    height: "16px",
  },
} as const

export const StyledLink = styled("a", styledLinkStyles)
// Internal-route variant styled the same way so we get one element with the
// proper `text-decoration: none`, instead of a wrapper <a> + inner span pair.
export const StyledRouterLink = styled(TSLink, styledLinkStyles)
