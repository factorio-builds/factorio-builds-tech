import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"

export const SubHeader = styled("div", {
  background: "#333642",
  padding: "20px 0",
  fontFamily: "$mono",
  fontSize: "16px",
  letterSpacing: "-0.025em",
  marginBottom: "10px",
})

export const SubHeaderLink = styled("a", {
  textDecoration: "underline",
  color: "$fadedBlue900",

  "&:hover": {
    color: "$fadedBlue700",
  },
})

export const BuildHeaderWrapper = styled("header", {
  marginBottom: "16px",
  padding: "10px 0",
  borderRadius: "7px",
  color: "$fadedBlue700",
})

export const BuildTitle = styled("h2", getTypo(ETypo.PAGE_HEADER), {
  color: "$fadedBlue900",
  margin: 0,
})

export const StyledLink = styled("a", {
  fontWeight: 700,
  color: "$fadedBlue900",
  textDecoration: "none",

  "&:hover": {
    color: "#fff",
    borderBottom: "2px solid #fff",
  },
})

export const BuildTags = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  margin: "0 -8px !important",
})

export const BuildHeaderMeta = styled("div", {
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  whiteSpace: "nowrap",
  margin: "4px",
  background: "#1c1c1c",
  padding: "4px 6px",
  border: "1px solid #4d4d4d",
  borderRadius: "4px",
  fontSize: "14px",

  img: {
    width: "20px",
    marginRight: "8px",
  },
})

export const Buttons = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  margin: "-4px",

  "> *": {
    boxSizing: "border-box",
    margin: "4px !important",
  },

  "@media screen and (max-width: 767px)": {
    "> *": {
      width: "calc(50% - 8px)",
    },
  },
})
