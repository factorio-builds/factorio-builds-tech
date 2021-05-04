import styled from "styled-components"
import { COLOR } from "../../../design/tokens/color"

export const InnerLink = styled.div`
  display: inline-block;
  cursor: pointer;
  color: ${COLOR.FADEDBLUE900};
  text-decoration: none;
`

export const InnerLinkLogOff = styled(InnerLink as any)`
  color: ${COLOR.DANGER};
`
