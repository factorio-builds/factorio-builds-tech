import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"
import Stacker from "../Stacker"

export const FilterListWrapper = styled.div``

export const Title = styled.div`
  ${getTypo(ETypo.FORM_LABEL)};
  margin-bottom: 8px;
`

export const Separator = styled.div`
  margin: 16px 0;
  width: 100%;
  height: 1px;
  background: #402e5b;
`

export const FilterGroup = styled.div`
  padding: 4px 20px 4px 0;
  margin-right: -20px;

  & + & {
    border-top: 1px solid ${COLOR.FADEDBLUE300};
  }
`

export const GroupName = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none;
  font-size: 14px;
  border: none;
  padding: 4px 0;
  color: ${COLOR.FADEDBLUE900};
  font-weight: 700;
  width: 100%;
  cursor: pointer;

  svg path {
    fill: #82d2a5;
  }
`

export const GroupFilters = styled(Stacker)`
  margin: 8px 0;
`
