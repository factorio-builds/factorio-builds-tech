import styled from "styled-components"

export const StackerWrapper = styled.div<{ gutter: number }>`
  display: flex;

  &.dir-horizontal {
    flex-direction: row;
  }

  &.dir-horizontal > * + * {
    margin-left: ${(props) => props.gutter}px;
  }

  &.dir-vertical {
    flex-direction: column;
  }

  &.dir-vertical > * + * {
    margin-top: ${(props) => props.gutter}px;
  }
`
