import { styled } from "../../../design/stitches.config"

export const BuildIconWrapper = styled("div", {
  boxSizing: "border-box",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  background: "linear-gradient(135deg, #235581, #133756)",
  border: "2px dashed #7fbace",

  img: {
    margin: "5% !important",
  },

  "&.large-icons img": {
    width: "80%",
    height: "80%",
  },

  "&.medium-icons img": {
    width: "40%",
    height: "40%",
  },

  "&.large-icons": {
    justifyContent: "center",
    alignItems: "center",
  },

  "&.size-medium": {
    width: "40px",
    height: "40px",
    flex: "0 0 40px",
  },

  "&.size-large": {
    width: "60px",
    height: "60px",
    flex: "0 0 60px",
  },
})
