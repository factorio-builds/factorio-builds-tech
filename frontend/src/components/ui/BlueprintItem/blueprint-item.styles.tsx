import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"
import Button from "../Button"
import Stacker from "../Stacker"

export const BlueprintItemWrapper = styled("div", {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  overflow: "hidden",
})

export const BlueprintItemInner = styled("div")

export const ImageWrapper = styled("div", {
  width: "200px",

  img: {
    cursor: "zoom-in",
  },

  "img.is-zoomed": {
    cursor: "zoom-out",
  },
})

export const SpinnerWrapper = styled("div", {
  background: "$fadedBlue100",
  height: "200px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})

export const InnerContent = styled(Stacker, {
  flexGrow: 1,
})

export const Content = styled("div", {
  padding: "16px",
  color: "$fadedBlue900",
  margin: "4px 0",
  background: "$card",
  borderRadius: "5px",
  border: "2px solid $card",

  ".is-highlighted &": {
    border: "2px solid $selected !important",
  },
})

export const Buttons = styled(Stacker, {
  display: "flex",
  marginTop: "16px",
})

export const ZoomedImage = styled("div", {
  marginTop: "16px",

  [`${ImageWrapper}, img`]: {
    width: "100%",
  },
})

export const Info = styled("div", {
  display: "flex",
  gap: "16px",
  marginTop: "16px",
  color: "$fadedBlue900",
})

export const Title = styled(Stacker, getTypo(ETypo.CARD_TITLE), {
  lineHeight: 1.1,
  display: "flex",
  alignItems: "center",
  minHeight: "28px",

  a: {
    color: "#fff",
  },
})

export const Meta = styled("small", {
  color: "$fadedBlue500",
  fontWeight: 400,
})

export const Expand = styled("button", {
  margin: 0,
  border: 0,
  padding: 0,
  background: "transparent",
  color: "$link",
  marginLeft: "auto !important",
  cursor: "pointer",
  flex: "0 0 auto",

  "&:hover": {
    color: "${lighten(0.05, COLOR.LINK)}",
  },
})

export const Expanded = styled("div")

export const Description = styled("p", {
  margin: 0,
  fontSize: "15px",

  "& + &": {
    margin: "16px 0 0 0",
  },
})

export const RequiredItems = styled("div")

export const Subtitle = styled("h3", getTypo(ETypo.METADATA_TITLE), {
  fontSize: "16px",
  marginTop: 0,
})

export const SelectRenderButton = styled(Button, {
  marginTop: "8px",
  alignSelf: "flex-end",
})
