import { styled } from "../../../design/stitches.config"
import Stacker from "../Stacker"

export const BodyWrapper = styled(Stacker, {
  width: "100%",
  flex: "1 0 auto",
})

export const ContentWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  flex: "1 0 auto",
})

export const Content = styled("main", {
  flex: "1 1 auto",
  display: "flex",
  flexDirection: "column",
  maxWidth: "100%",
  marginBottom: "20px",

  "> :first-child": {
    marginTop: 0,
  },

  "> :last-child": {
    marginBottom: 0,
  },
})

export const Backdrop = styled("div", {
  zIndex: 1,
  background: "rgba(0, 0, 0, 0.7)",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
})
