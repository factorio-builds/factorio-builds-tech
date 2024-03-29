import { styled } from "../../../design/stitches.config"

export const BuildCardListWrapper = styled("div")

export const Header = styled("div", {
  background: "#333642",
  margin: "0 -20px 20px",
  padding: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
})

export const Columns = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  alignContent: "flex-start",
  gap: "var(--gutter)",
})

export const Column = styled("div", {
  "--width": `calc(100% / var(--cols) - (var(--gutter) * (var(--cols) - 1) / var(--cols)))`,
  flex: "0 0 var(--width)",
  width: "var(--width)",
})

export const Item = styled("div", {
  "& + &": {
    marginTop: "var(--gutter)",
  },
})
