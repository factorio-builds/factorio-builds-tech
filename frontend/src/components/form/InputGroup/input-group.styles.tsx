import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"

export const StyledInputGroup = styled("div", {
  display: "flex",
  flexDirection: "column",
})

export const Legend = styled("div", getTypo(ETypo.FORM_LABEL), {
  color: "$fadedBlue900",

  span: {
    fontWeight: 400,
  },
})
