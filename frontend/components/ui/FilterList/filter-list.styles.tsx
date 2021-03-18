import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"
import Caret from "../../../icons/caret"
import Stacker from "../Stacker"

export const FilterListWrapper = styled.div``

export const Title = styled.div`
  ${getTypo(ETypo.FORM_LABEL)};
  margin-bottom: 8px;
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
  background: none;
  font-size: 14px;
  border: none;
  padding: 4px 0;
  height: 20px;
  color: ${COLOR.FADEDBLUE900};
  font-weight: 700;
  width: 100%;
  cursor: pointer;

  svg path {
    fill: #82d2a5;
  }
`

export const GroupCount = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #2b4564 0%, #333642 100%);
  width: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  margin-left: 8px;
`

export const GroupFilters = styled(Stacker)`
  margin: 8px 0;
`

export const StyledCaret = styled(Caret)`
  margin-left: auto;
`
