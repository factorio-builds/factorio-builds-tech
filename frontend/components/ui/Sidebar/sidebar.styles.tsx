import { styled } from "../../../design/stitches.config"

export const SidebarWrapper = styled("aside", {
  width: "300px",
  flex: "0 0 300px",
  padding: "20px 20px 20px 0",
  background: "$sidebar",
  borderRight: "1px solid $fadedBlue300",
  height: "calc(100vh - var(--headerHeight) - 40px)",
  position: "sticky",
  top: 0,
  bottom: 0,
  overflowY: "scroll",

  "&::-webkit-scrollbar-track": {
    borderRadius: "10px",
    backgroundColor: "$sidebar",
  },

  "&::-webkit-scrollbar": {
    width: "12px",
    backgroundColor: "$sidebar",
  },

  "&::-webkit-scrollbar-thumb": {
    borderRadius: "10px",
    boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
    backgroundColor: "$fadedBlue300",
    border: "3px solid $sidebar",
  },

  "@media screen and (max-width: 767px)": {
    position: "absolute",
    top: "$headerHeight",
    left: 0,
    maxWidth: "400px",
    right: "40px",
    padding: "20px",
    width: "auto",
    zIndex: 5,
    height: "calc(100vh - $headerHeight - 40px)",
    overflowY: "scroll",
  },
})

export const SidebarContent = styled("div", {
  position: "relative",
  zIndex: 1,
})

export const SidebarBG = styled("div", {
  position: "absolute",
  background: "$sidebar",
  top: 0,
  bottom: 0,
  right: 0,
  width: "100vw",
})
