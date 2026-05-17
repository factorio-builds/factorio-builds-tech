import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"
import Container from "../Container"

export const HeaderWrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  background: "$subHeader",
  color: "$fadedBlue900",
  padding: "25px 20px",

  [`${Container}`]: {
    flexDirection: "column",
    justifyContent: "center",
  },
})

export const Title = styled("h1", getTypo(ETypo.PAGE_HEADER), {
  display: "flex",
  alignItems: "center",
  color: "#fff",
  margin: 0,

  img: {
    width: "32px",
    height: "auto",
    marginRight: "8px",
  },
})

export const Subtitle = styled("div", getTypo(ETypo.PAGE_SUBTITLE), {
  color: "#a392b5",
})
