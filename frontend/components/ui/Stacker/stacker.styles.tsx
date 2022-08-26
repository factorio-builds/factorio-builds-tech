import { styled } from "../../../design/stitches.config"

export const StackerWrapper = styled("div", {
  display: "flex",
  gap: "var(--gutter)",

  variants: {
    orientation: {
      horizontal: {
        flexDirection: "row",
      },

      vertical: {
        flexDirection: "column",
      },
    },
  },
})
