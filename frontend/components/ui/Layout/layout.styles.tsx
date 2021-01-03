import styled from "styled-components"
import Stacker from "../Stacker"

export const BodyWrapper = styled(Stacker)`
  width: 100%;
`

export const Content = styled.main`
  padding: 20px 0;
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
