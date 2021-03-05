import styled from "styled-components"

export const BuildCardListWrapper = styled.div`
  margin-top: -20px !important;
`

export const Header = styled.div`
  background: #333642;
  margin: 0 -20px 20px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Columns = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: var(--gutter);
`

export const Column = styled.div`
  --width: calc(
    100% / var(--cols) - (var(--gutter) * (var(--cols) - 1) / var(--cols))
  );
  flex: 0 0 var(--width);
  width: var(--width);
`

export const Item = styled.div`
  & + & {
    margin-top: var(--gutter);
  }
`
