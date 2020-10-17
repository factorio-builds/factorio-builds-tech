import styled from "styled-components"

export const StackerWrapper = styled.div<{ gutter: number }>`
  display: flex;

  & > * + * {
    margin-top: ${(props) => props.gutter}px;
  }

  &.dir-horizontal {
    flex-direction: row;
  }

  &.dir-vertical {
    flex-direction: column;
  }
`
