import { styled, keyframes } from "../../../design/stitches.config"

const loading = keyframes({
  "0%, 80%, 100%": {
    boxShadow: "0 2.5em 0 -1.3em",
    "40%": {
      boxShadow: "0 2.5em 0 0",
    },
  },
})

export const SpinnerWrapper = styled("div", {
  "&": {
    color: "#fff",
    fontSize: "3px",
    position: "relative",
    transform: "translateZ(0)",
    animationDelay: "-0.16s",
    margin: "0 3.5em",
  },

  "&, &:before, &:after": {
    borderRadius: "50%",
    width: "2.5em",
    height: "2.5em",
    animationFillMode: "both",
    animation: `${loading} 1.8s infinite ease-in-out`,
  },

  "&:before, &:after": {
    content: "",
    position: "absolute",
    top: 0,
  },

  "&:before": {
    left: "-3.5em",
    animationDelay: "-0.32s",
  },

  "&:after": {
    left: "3.5em",
  },
})
