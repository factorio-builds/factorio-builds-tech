import { getTypo } from "../../../design/helpers/typo"
import { css, styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"

const baseInput = css({
  padding: "5px 14px",
  background: "$input",
  border: "2px solid $fadedBlue500",
  color: "$fadedBlue700",

  "&:hover": {
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
  },

  ".is-error &": {
    borderColor: "$danger !important",
  },

  "&:focus, &:focus-within": {
    boxShadow: "0 0 0 3px #aad1ff",
    outline: "none",
  },
})

export const StyledInputWrapper = styled("div", baseInput, {
  display: "flex",
  alignItems: "center",
  borderRadius: "6px",
})

export const StyledInput = styled("input", getTypo(ETypo.FORM_INPUT), {
  lineHeight: 1.8,
  border: 0,
  background: "transparent",
  color: "$fadedBlue700",
  flex: "1 0 auto",

  "&:focus": {
    outline: 0,
  },

  "&::placeholder": {
    color: "$fadedBlue500",
  },

  // fix for chrome autocomplete
  "&:-webkit-autofill, &:-internal-autofill-selected": {
    boxShadow: "0 0 0 50px $input inset",
    "-webkit-text-fill-color": "$fadedBlue700",
  },
})

export const StyledTextarea = styled(
  "textarea",
  getTypo(ETypo.FORM_INPUT),
  baseInput,
  {
    padding: "11px 14px",
    resize: "vertical",
    minHeight: "200px",
    borderRadius: "6px",

    "&::placeholder": {
      color: "$fadedBlue500",
    },
  }
)

export const Prefix = styled("div", {
  pointerEvents: "none",
  color: "$fadedBlue500",
  paddingRight: "4px",
})
