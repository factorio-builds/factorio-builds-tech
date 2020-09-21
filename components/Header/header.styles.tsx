import styled from "styled-components"
import { ContainerWrapper as Container } from "../Container/container.styles"

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #8fce5b;
  height: 74px;
  padding: 0 20px;

  ${Container} {
    align-items: center;
  }
`

export const CreateBuildButton = styled.button`
  background: linear-gradient(180deg, #7950b9 0%, #543b7a 100%);
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 17px;
  line-height: 38px;
  padding: 0 14px;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    background: linear-gradient(180deg, #613d99 0%, #3d2b59 100%);
  }
`
