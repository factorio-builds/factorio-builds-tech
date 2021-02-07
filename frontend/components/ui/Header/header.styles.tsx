import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"
import Logo from "../../../icons/logo"
import { ContainerWrapper as Container } from "../Container/container.styles"
import Stacker from "../Stacker"

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${COLOR.HEADER};
  height: 74px;

  ${Container} {
    align-items: center;
  }
`

export const StyledLogo = styled(Logo)`
  height: 40px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`

export const CreateBuildButton = styled.button`
  ${getTypo(ETypo.BUTTON)};
  background: linear-gradient(180deg, #50b97f 0%, #3b7a58 100%);
  color: #ffffff;
  border: none;
  border-radius: 5px;
  line-height: 38px;
  padding: 0 14px;
  cursor: pointer;

  &:hover {
    background: linear-gradient(180deg, #40a06b 0%, #2e6046 100%);
  }
`

export const StyledStacker = styled(Stacker)`
  align-items: center;
  margin-left: auto;
`

export const InnerLink = styled.span`
  ${getTypo(ETypo.BUTTON)};
  color: ${COLOR.FADEDBLUE700};
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    color: ${COLOR.FADEDBLUE900};
  }
`
