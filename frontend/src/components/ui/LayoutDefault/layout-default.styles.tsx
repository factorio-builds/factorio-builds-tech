import { styled } from "../../../design/stitches.config"
import Stacker from "../Stacker"

export const ContentWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  flex: "1 0 auto",
})

export const BodyWrapper = styled(Stacker, {
  width: "100%",
  flex: "1 0 auto",
})

export const Content = styled("main", {
  flex: "1 1 auto",
  display: "flex",
  flexDirection: "column",
  maxWidth: "100%",

  "> :first-child": {
    marginTop: 0,
  },

  "> :last-child": {
    marginBottom: 0,
  },
})

export const Footer = styled("footer", {
  marginTop: "20px",
  borderTop: "1px solid $fadedBlue300",
  padding: "16px 0",
})
