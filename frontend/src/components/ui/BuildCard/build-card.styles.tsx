import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"
import Stacker from "../Stacker"

export const BuildCardWrapper = styled("div", {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  cursor: "pointer",
  borderRadius: "4px",
  background: "$card",
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
  overflow: "hidden",
  padding: "10px",
  transition: "box-shadow 0.3s, background 0.3s",

  "&:hover": {
    background: "${darken(0.075, COLOR.CARD)}",
    boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
  },

  "&.is-pressed": {
    transform: "scale(1.02)",
  },
})

export const ImageWrapper = styled("div", {
  width: "100%",
  filter: "contrast(0.8)",

  img: {
    borderRadius: "3px",
  },

  [`${BuildCardWrapper}:hover &`]: {
    filter: "contrast(1)",
  },
})

export const Content = styled("div", {
  padding: "10px 0 0",
  color: "$fadedBlue900",

  [`${BuildCardWrapper}:hover &`]: {
    color: "#fff",
  },
})

export const Title = styled(Stacker, getTypo(ETypo.CARD_TITLE), {
  lineHeight: 1.1,
  display: "flex",
  alignItems: "center",
  minHeight: "28px",
  margin: "0 0 4px",

  a: {
    color: "#fff",
  },
})

export const Categories = styled(Stacker, {
  marginTop: "8px",
  flexWrap: "wrap",
  gap: "3px",

  "> *": {
    margin: "0 !important",
  },
})

export const Category = styled("div", getTypo(ETypo.METADATA), {
  fontSize: "12px",
  background: "#1f2128",
  color: "#9ca4c3",
  textTransform: "lowercase",
  padding: "2px 4px",
  border: "1px solid #2d2f39",
  borderRadius: "3px",

  [`${BuildCardWrapper}:hover &`]: {
    color: "${lighten(0.05, '#9CA4C3')}",
  },
})
