import styled from "styled-components"
import { COLOR } from "../../../design/tokens/color"
import Stacker from "../Stacker"

export const LinksWrapper = styled(Stacker)`
  align-items: flex-start;
`

export const StyledLink = styled.a`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${COLOR.FADEDBLUE700};
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  svg {
    margin-right: 8px;
    width: 16px;
    height: 16px;
  }
`
