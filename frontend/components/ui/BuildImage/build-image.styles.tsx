import styled from "styled-components"

export const OuterWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: calc((1 / var(--ratio)) * 100%);
`

export const InnerWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`
