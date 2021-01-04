import styled from "styled-components"

export const BuildListWrapper = styled.div`
  h2 {
    margin-top: 0;
  }
`

export const Table = styled.table`
  width: 100%;
  text-align: left;

  th,
  td {
    padding: 4px;
  }

  tr td:first-child {
    padding-left: 0;
  }

  tr td:last-child {
    padding-right: 0;
  }
`
