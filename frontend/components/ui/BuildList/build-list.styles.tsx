import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"
import Stacker from "../Stacker"

export const BuildListWrapper = styled.div``

export const Title = styled(Stacker)`
  ${getTypo(ETypo.PAGE_HEADER)};
  align-items: center;
  font-weight: 400;
`

export const Subtitle = styled.div`
  ${getTypo(ETypo.PAGE_SUBTITLE)};
  font-weight: 400;
`

export const Table = styled.table`
  width: 100%;
  text-align: left;
  border-spacing: 0px;

  thead th {
    padding-bottom: 10px !important;
  }

  thead th svg {
    margin-right: 4px;
  }

  tr th,
  tr td {
    border-bottom: 1px solid ${COLOR.FADEDBLUE300};
  }

  th,
  td {
    padding: 8px;
  }

  tr:nth-child(odd) td {
    background: ${COLOR.SUB};
  }

  img {
    display: block;
  }

  a {
    color: #fff;
    font-weight: 700;
    text-decoration: none;
  }

  a:hover {
    border-bottom: 2px solid #fff;
  }
`
