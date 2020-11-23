import styled from "styled-components"
import Stacker from "../../components/Stacker"
import { COLOR } from "../../design/tokens/color"

export const Row = styled.div`
  display: flex;
  gap: 50px;
`

export const Content = styled.div`
  flex: 0 1 calc(100% - 300px);
`

export const Sidebar = styled.div`
  flex: 0 0 300px;
`

export const ButtonsStack = styled(Stacker)`
  margin-top: 16px;
`

export const SkipButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: ${COLOR.PURPLE700};
  font-size: 17px;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: ${COLOR.PURPLE900};
  }
`
