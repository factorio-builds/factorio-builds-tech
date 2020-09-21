import styled from "styled-components"

export const BuildCardListWrapper = styled.div`
  --cols: 3;
  --gutter: 16px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: var(--gutter);
`

export const Item = styled.div`
  flex: 0 0
    calc(100% / var(--cols) - (var(--gutter) * (var(--cols) - 1) / var(--cols)));
`
