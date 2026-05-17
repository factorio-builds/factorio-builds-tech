import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"
import Button from "../Button"

export const FavoriteButtonWrapper = styled(Button, getTypo(ETypo.BUTTON), {
  pointerEvents: "none",

  "&.is-error": {
    border: "1px solid red",
  },

  "&.is-clickable": {
    pointerEvents: "auto",
    cursor: "pointer",
  },
})
