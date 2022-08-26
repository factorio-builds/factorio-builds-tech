import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"
import Stacker from "../Stacker"

export const BuildListWrapper = styled("div", {
  margin: "20px 0",
  width: "100%",
})

export const Title = styled(Stacker, getTypo(ETypo.PAGE_HEADER), {
  alignItems: "center",
  fontWeight: 400,
})

export const Subtitle = styled("div", getTypo(ETypo.PAGE_SUBTITLE), {
  fontWeight: 400,
})

export const Sort = styled("button", {
  cursor: "pointer",
  background: "transparent",
  border: "none",
  color: "#fff",
})

export const Table = styled("table", {
  width: "100%",
  textAlign: "left",
  borderSpacing: 0,

  "thead th": {
    paddingBottom: "10px !important",
  },

  "thead th svg": {
    marginRight: "4px",
  },

  "tr th, tr td": {
    borderBottom: "1px solid $fadedBlue300",
  },

  "th, td": {
    padding: "8px",
  },

  "tr:nth-child(odd) td": {
    background: "$sub",
  },

  img: {
    display: "block",
  },

  a: {
    color: "#fff",
    fontWeight: 700,
    textDecoration: "none",
  },

  "a:hover": {
    borderBottom: "2px solid #fff",
  },
})
