import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"
import Stacker from "../../ui/Stacker"

export const Content = styled("div")

export const ButtonsStack = styled(Stacker, {
  marginTop: "16px",
})

export const TextButton = styled("button", getTypo(ETypo.BUTTON), {
  background: "none",
  border: "none",
  padding: 0,
  color: "$fadedBlue700",
  textDecoration: "underline",
  cursor: "pointer",

  "&:hover": {
    color: "$fadedBlue900",
  },
})

export const CollapsableGroupWrapper = styled("div", {
  background: "$input",
  borderRadius: "6px",
  padding: "10px",
})

export const GroupTitle = styled("button", {
  padding: 0,
  margin: 0,
  border: 0,
  background: "transparent",
  font: "inherit",
  color: "inherit",
  cursor: "pointer",
  position: "relative",
  display: "flex",
  alignItems: "center",
  fontSize: "16px",

  svg: {
    marginLeft: "3px",
    marginRight: "15px",
  },

  "svg path": {
    fill: "$fadedBlue500",
  },
})

export const GroupCount = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(90deg, #2b4564 0%, #333642 100%)",
  width: "20px",
  height: "20px",
  borderRadius: "6px",
  fontSize: "10px",
  fontWeight: 700,
  marginLeft: "8px",
})

export const CoverWrapper = styled("div")

export const PageButton = styled(Stacker, getTypo(ETypo.PAGE_SUBTITLE), {
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  borderRadius: "4px",
  overflow: "hidden",
  background: "$card",
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
  padding: "16px",
  border: "2px solid $card",

  "&:hover": {
    background: "${lighten(0.05, COLOR.CARD)}",
    borderColor: "${lighten(0.05, COLOR.CARD)}",
  },

  "&.is-active": {
    background: "${lighten(0.05, COLOR.CARD)}",
    borderColor: "$fadedBlue500",
    pointerEvents: "none",
  },
})

export const PageNumber = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "30px",
  height: "30px",
  border: "2px solid $fadedBlue700",
  borderRadius: "5px",
  marginRight: "8px",

  ".is-active &": {
    background: "$fadedBlue700",
    color: "$background",
  },
})

export const PageBody = styled(Stacker)

export const PageFeedback = styled(Stacker, {
  color: "$danger",
  alignItems: "center",

  svg: {
    width: "20px",
  },

  "svg path": {
    fill: "$danger",
  },

  "&.is-valid": {
    color: "$success",
  },

  "&.is-optional": {
    color: "$fadedBlue500",
  },

  "&.is-valid svg path": {
    fill: "$success",
  },
})

export const InputHint = styled("div", {
  marginTop: "8px !important",
  background: "linear-gradient(90deg, #2b4564 0%, #333642 100%)",
  color: "$fadedBlue900",
  padding: "10px 14px",
  borderRadius: "5px",
})

export const RenderedCovers = styled("div")

export const Rendered = styled("div", {
  borderRadius: "4px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",

  img: {
    display: "block",
    maxWidth: "100%",
    maxHeight: "calc(100vh - 40px)",
  },
})

export const WaitingForRender = styled("div", {
  background: "linear-gradient(90deg, #2b4564 0%, #333642 100%)",
  padding: "16px",
  borderRadius: "6px",
})
