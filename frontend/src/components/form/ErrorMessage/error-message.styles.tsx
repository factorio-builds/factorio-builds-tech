import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"

export const ErrorMessageWrapper = styled("div", getTypo(ETypo.FORM_INPUT), {
  display: "flex",
  alignItems: "center",
  color: "$danger",
  marginTop: "4px",
})
