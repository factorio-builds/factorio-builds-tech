import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"

export const BuildListLookupStatWrapper = styled("div", getTypo(ETypo.BODY), {
  fontSize: "16px",
})

export const Count = styled("div", {
  color: "$fadedBlue700",
})
