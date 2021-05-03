import styled from "styled-components"
import { COLOR } from "../../../design/tokens/color"
import Stacker from "../Stacker"

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`

export const BodyWrapper = styled(Stacker)`
  width: 100%;
  flex: 1 0 auto;
`

export const Content = styled.main`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  max-width: 100%;

  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }
`

export const Footer = styled.footer`
  margin-top: 20px;
  border-top: 1px solid ${COLOR.FADEDBLUE300};
  padding: 16px 0;
`
