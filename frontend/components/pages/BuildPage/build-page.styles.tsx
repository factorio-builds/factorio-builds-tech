import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"
import { Footer } from "../../ui/LayoutDefault/layout-default.styles"
import Stacker from "../../ui/Stacker"

export const LayoutWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",

  [`${Footer}`]: {
    marginTop: 0,
  },
})

export const BuildImage = styled("div", {
  border: "8px solid $card",
  width: "100%",

  img: {
    display: "block",
    width: "100%",
  },
})

export const ZoomedImage = styled("div", {
  overflow: "hidden",
  position: "relative",
  borderBottom: "1px solid $fadedBlue300",

  [`${BuildImage}`]: {
    border: "none",
    margin: "8px 0",
  },
})

export const GlowWrapper = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: "$card",

  svg: {
    opacity: "0.85",
    width: "100%",
  },
})

export const ImageWrapper = styled("div", {
  cursor: "zoom-in",

  ".is-zoomed &": {
    cursor: "zoom-out",
  },
})

export const CopyClipboardWrapper = styled("div", {
  marginBottom: "16px",
})

export const EditBuild = styled("span", {
  alignSelf: "flex-start",
  cursor: "pointer",
  color: "$link",
  borderBottom: "1px solid $link",

  "&:hover": {
    color: "${lighten(0.3, COLOR.LINK)}",
    borderColor: "${lighten(0.3, COLOR.LINK)}",
  },
})

export const BlueprintData = styled("textarea", {
  flex: "1 0 auto",
  boxSizing: "border-box",
  wordWrap: "break-word",
  maxHeight: "400px",
  overflowY: "scroll",
  marginTop: "12px",
  background: "transparent",
  color: "$fadedBlue900",
  border: "none",
  width: "100%",
})

export const TabsWrapper = styled("div", {
  flex: "1 0 auto",
  display: "flex",
  flexDirection: "column",
})

export const TabsInnerWrapper = styled("div", {
  borderBottom: "1px solid $fadedBlue300",
})

export const TabsItems = styled(Stacker, {
  "--scrollbarBG": "$background",
  "--thumbBG": "$fadedBlue300",

  scrollbarWidth: "thin",
  scrollbarColor: "var(--thumbBG) var(--scrollbarBG)",

  "@media screen and (max-width: 767px)": {
    overflowX: "scroll",
    overflowY: "hidden",
  },

  "&::-webkit-scrollbar": {
    width: "11px",
    height: "11px",
  },

  "&::-webkit-scrollbar-track": {
    background: "var(--scrollbarBG)",
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "var(--thumbBG)",
    borderRadius: "6px",
    border: "3px solid var(--scrollbarBG)",
  },
})

export const TabsContent = styled("div", {
  display: "flex",
  flex: "1 0 auto",
})

export const TabsContentInner = styled("div", {
  flex: "1 1 auto",
  display: "flex",
})

export const TabsAside = styled("aside", {
  flex: "0 0 400px",
  width: "400px",
  paddingTop: "16px",
  paddingBottom: "16px",
  paddingLeft: "16px",
  borderLeft: "1px solid $fadedBlue300",
  marginLeft: "16px",

  ".is-zoomed &": {
    opacity: 0,
  },
})

export const Tab = styled("a", getTypo(ETypo.BUTTON), {
  position: "relative",
  textDecoration: "none",
  padding: "10px 0",
  color: "$fadedBlue900",
  cursor: "pointer",
  whiteSpace: "nowrap",

  "&::after": {
    position: "absolute",
    content: "",
    height: "2px",
    left: 0,
    right: 0,
    bottom: "-1px",
  },

  "&:hover::after": {
    background: "$fadedBlue900",
  },

  "&.is-active": {
    fontWeight: 700,
  },

  "&.is-active::after": {
    background: "$fadedBlue900",
  },
})

export const TabWrapper = styled("div", {
  display: "none",
  padding: "16px 0",

  "& > :first-child": {
    marginTop: 0,
  },

  "& > :last-child": {
    marginBottom: 0,
  },

  "&.is-active": {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 auto",
  },
})

export const Description = styled("div", {
  "> :first-child": {
    marginTop: 0,
  },

  "> :last-child": {
    marginBottom: 0,
  },
})
