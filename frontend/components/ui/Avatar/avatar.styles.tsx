import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"

export const AvatarWrapper = styled("div", getTypo(ETypo.BODY), {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "22px",
  height: "22px",
  background: "linear-gradient(153.43deg, #37d291 0%, #225594 106.06%)",

  "&.size-medium": {
    width: "22px",
    height: "22px",
    fontSize: "13px",
    borderRadius: "5px",
  },

  "&.size-large": {
    width: "28px",
    height: "28px",
    fontSize: "15px",
    borderRadius: "5px",
    fontWeight: 700,
  },
})
