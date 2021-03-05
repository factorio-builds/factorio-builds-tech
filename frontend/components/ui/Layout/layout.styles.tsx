import styled from "styled-components"
import Stacker from "../Stacker"

export const BodyWrapper = styled(Stacker)`
  width: 100%;
`

export const Content = styled.main`
  margin-top: 20px;
  padding-bottom: 20px;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;

  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }
`

export const Backdrop = styled.div`
  z-index: 1;
  background: rgba(0, 0, 0, 0.7);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`
