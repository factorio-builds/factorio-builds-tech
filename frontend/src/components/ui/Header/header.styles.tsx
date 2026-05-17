import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"
import Logo from "../../../icons/logo"
import { ContainerWrapper as Container } from "../Container/container.styles"
import Stacker from "../Stacker"

export const HeaderWrapper = styled("header", {
  display: "flex",
  alignItems: "center",
  background: "$header",
  height: "$headerHeight",
  position: "relative",
  zIndex: 2,

  [`${Container}`]: {
    alignItems: "center",
  },
})

export const BurgerButton = styled("button", {
  background: "transparent",
  border: "none",
  marginLeft: "-8px",
  padding: "8px",
  marginRight: "8px",
})

export const StyledLogo = styled(Logo, {
  height: "40px",
  cursor: "pointer",

  "&:hover": {
    opacity: 0.8,
  },
})

export const CreateBuildButton = styled("button", getTypo(ETypo.BUTTON), {
  background: "linear-gradient(180deg, #50b97f 0%, #3b7a58 100%)",
  color: "#ffffff",
  border: "none",
  borderRadius: "5px",
  lineHeight: "38px",
  padding: "0 14px",
  cursor: "pointer",

  "&:hover": {
    background: "linear-gradient(180deg, #40a06b 0%, #2e6046 100%)",
  },
})

export const StyledStacker = styled(Stacker, {
  alignItems: "center",
  marginLeft: "auto",
})

export const InnerLink = styled("a", getTypo(ETypo.BUTTON), {
  color: "$fadedBlue700",
  textTransform: "uppercase",
  cursor: "pointer",
  textDecoration: "none",

  "&:hover": {
    color: "$fadedBlue900",
  },
})
