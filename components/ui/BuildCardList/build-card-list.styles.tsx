import styled from "styled-components"
import { COLS, GUTTER } from "./design-tokens"

export const BuildCardListWrapper = styled.div`
  --cols: ${COLS};
  --gutter: ${GUTTER}px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: var(--gutter);
`

export const Column = styled.div`
  flex: 0 0
    calc(100% / var(--cols) - (var(--gutter) * (var(--cols) - 1) / var(--cols))); ;
`

export const Item = styled.div`
  & + & {
    margin-top: var(--gutter);
  }
`
