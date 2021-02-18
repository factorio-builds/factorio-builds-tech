import styled from "styled-components"

export const ContainerWrapper = styled.div`
  width: calc(100% - 20px * 2);
  margin: 0 auto;
  display: flex;
  padding: 0 20px;
  flex: 1;

  &.dir-row {
    flex-direction: row;
  }

  &.dir-column {
    flex-direction: column;
  }

  &.size-medium {
    width: calc(1366px - 20px * 2);
    max-width: calc(100% - 20px * 2);
  }
`
