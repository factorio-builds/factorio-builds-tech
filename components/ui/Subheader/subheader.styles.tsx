import styled from "styled-components"
import { COLOR } from "../../../design/tokens/color"
import { ContainerWrapper as Container } from "../Container/container.styles"

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${COLOR.SUBHEADER};
  color: ${COLOR.PURPLE900};
  padding: 25px 20px;

  ${Container} {
    flex-direction: column;
    justify-content: center;
  }

  h1 {
    margin: 0;
    font-size: 28px;
  }
`
