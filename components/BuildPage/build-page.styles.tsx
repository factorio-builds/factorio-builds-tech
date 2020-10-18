import styled from "styled-components"
import { COLOR } from "../../design/tokens/color"

export const Wrapper = styled.div`
  margin-left: -34px;
  margin-top: -20px;
`

export const BuildImage = styled.div`
  img {
    display: block;
    width: 100%;
  }
`

export const Heading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 21px 34px;
  background: linear-gradient(268.31deg, #f2f0f4 30.66%, #dad6e1 100%), #e5e2ea;
`

export const Title = styled.h2`
  font-size: 28px;
  color: ${COLOR.GREY300};
`

export const Content = styled.div`
  display: flex;
  gap: 34px;
  padding: 20px 34px;
`

export const Aside = styled.aside`
  font-size: 13px;
  flex: 0 0 250px;
`

export const AsideGroup = styled.section`
  & + & {
    margin-top: 8px;
    border-top: 1px solid #cfcfcf;
    padding: 8px 0;
  }
`

export const AsideGroupTitle = styled.h3`
  margin: 0;
  font-weight: 700;
  font-size: 13px;
  margin-bottom: 4px;
`

export const AsideSubGroup = styled.div`
  & + & {
    margin-top: 4px;
  }
`

export const Main = styled.main`
  flex: 1 1 auto;
`

export const MainTitle = styled.h3`
  font-weight: 700;
  margin-top: 0;
  font-size: 16px;
  color: #000;
`

export const MainContent = styled.div`
  font-size: 16px;
  color: #424242;

  > ::first-child {
    margin-top: 0;
  }

  > ::last-child {
    margin-bottom: 0;
  }
`

export const ExpandBlueprint = styled.button`
  background: none;
  border: none;
  color: #67469b;
  padding: 0;
  font-size: 16px;
`

export const Blueprint = styled.div`
  margin-top: 10px;
  background: #eeeeee;
  padding: 16px;
`

export const BlueprintData = styled.textarea`
  word-wrap: break-word;
  max-height: 400px;
  overflow-y: scroll;
  margin-top: 12px;
  background: transparent;
  border: none;
  width: 100%;
`

export const TogglerWrapper = styled.div`
  display: flex;
  gap: 16px;
`

export const Toggler = styled.div`
  user-select: none;
  position: relative;
  cursor: pointer;

  &::after {
    position: absolute;
    bottom: -5px;
    left: 0;
    right: 0;
    content: "";
    background: transparent;
  }

  &:hover::after {
    height: 1px;
    background: #000;
  }

  &.is-selected {
    font-weight: 700;
  }

  &.is-selected::after {
    height: 3px;
    background: #000;
  }
`
