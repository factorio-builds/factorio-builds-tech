import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"

export const StyledInputWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",

  "&.size-small": {
    maxWidth: "250px",
  },
})

export const Label = styled("label", getTypo(ETypo.FORM_LABEL), {
  color: "$fadedBlue900",
  marginBottom: "6px",

  span: {
    fontWeight: 400,
  },
})

export const ValidMessage = styled("div", getTypo(ETypo.FORM_INPUT), {
  display: "flex",
  alignItems: "center",
  color: "#68c06b",
  marginTop: "8px",

  "& svg": {
    width: "16px",
    marginRight: "8px",
  },

  "& svg path": {
    fill: "#68c06b",
  },
})
