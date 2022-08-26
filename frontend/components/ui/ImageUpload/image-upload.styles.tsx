import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"
import Lamp from "../../../icons/lamp"

export const ImageUploadWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
})

export const UploadZone = styled("div", {
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  boxSizing: "border-box",
  border: "2px dashed $fadedBlue300",
  overflowY: "hidden",
  margin: "0 auto",
  cursor: "pointer",
  background: "$input",
  padding: "8px",
  width: "100%",
  height: "373px",

  ".has-image &": {
    height: "auto",
  },

  "&:active, &:focus": {
    outline: "none",
    boxShadow: "0 0 0 3px #40a9ff !important",
  },

  "&:hover::after": {
    content: "",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.25)",
  },

  ".has-image &:hover::after": {
    borderColor: "#fff",
  },
})

export const ImagePreview = styled("img", {
  display: "block",
  width: "100%",
})

export const Hint = styled("div", getTypo(ETypo.FORM_INPUT), {
  position: "relative",
  zIndex: 1,
  color: "$fadedBlue700",
  letterSpacing: "0.05em",
})

export const NoImageBackdrop = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `url("/img/image-backdrop.jpg")`,
  backgroundSize: "cover",
  backgroundPosition: "50% 50%",
})

export const Recommended = styled("div", {
  display: "flex",
  alignItems: "center",
  background: "$fadedBlue300",
  color: "$fadedBlue700",
  padding: "14px 14px",
  fontSize: "12px",
  marginTop: "7px",
})

export const StyledLamp = styled(Lamp, {
  flex: "0 0 23px",
  width: "23px",
  marginRight: "15px",
})

export const Feedback = styled("div", getTypo(ETypo.FORM_INPUT), {
  padding: "10px 0",

  svg: {
    width: "15px",
    marginRight: "8px",
  },

  "&.variant-positive": {
    color: "#68c06b",

    "svg path": {
      fill: "#68c06b",
    },
  },

  "&.variant-warning": {
    color: "#fde92e",

    "svg path": {
      fill: "#fde92e",
    },
  },
})
