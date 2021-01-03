import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"
import Stacker from "../Stacker"

export const DropdownWrapper = styled.div`
  height: 38px;
  user-select: none;
`

export const Dropdown = styled.div`
  position: relative;
  background: ${COLOR.HEADER};
  margin-left: -12px;
  margin-top: -2px;
  border: 2px solid transparent;
  border-radius: 10px;
  padding: 10px 17px;

  .is-open & {
    border-color: ${COLOR.PURPLE500};
  }
`

const StyledStacker = (props: any) => (
  <Stacker {...props} orientation="horizontal" gutter={10} />
)

export const User = styled(StyledStacker)`
  display: flex;
  align-items: center;
  cursor: pointer;

  svg path {
    fill: ${COLOR.PURPLE500};
  }
`

export const Avatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  background: linear-gradient(153.43deg, #37d291 0%, #225594 106.06%);
  border-radius: 5px;
  ${getTypo(ETypo.BODY)}
  font-size: 13px;
`

export const DropdownContent = styled.div`
  display: none;
  margin: 4px 0;
  flex-direction: column;
  text-align: right;
  align-items: flex-end;

  .is-open & {
    display: flex;
  }
`

export const Spacer = styled.div`
  width: 100%;
  border-top: 1px solid ${COLOR.PURPLE300};
  margin: 8px 0;
`

export const InnerLink = styled.a`
  display: inline-block;
  cursor: pointer;
  color: ${COLOR.DANGER};

  &:hover {
    text-decoration: underline;
  }
`
