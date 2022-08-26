import { styled } from "../../../design/stitches.config"
import Stacker from "../Stacker"

export const LinksWrapper = styled(Stacker, {
  alignItems: "flex-start",
})

export const StyledLink = styled("a", {
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
})
