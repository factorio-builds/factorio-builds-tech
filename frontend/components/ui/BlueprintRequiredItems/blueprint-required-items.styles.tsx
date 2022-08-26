import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"
import ItemIcon from "../ItemIcon"
import Stacker from "../Stacker"

export const WithRequiredItem = styled(Stacker, getTypo(ETypo.METADATA), {
  fontSize: "16px",
  alignItems: "center",
})

export const IconImg = styled(ItemIcon, {
  width: "20px",
  marginRight: "4px",
})
