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

// TODO: move?
export const HeadingSmall = styled.small`
  display: flex;
  align-items: center;
  font-weight: 700;
  color: ${COLOR.PURPLE500};
`

export const Book = styled.img`
  height: 24px;
  margin-right: 4px;
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
    border-top: 1px solid ${COLOR.PURPLE500};
    padding-top: 8px;
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

export const StyledRequiredItem = styled.div`
  display: flex;
  align-items: center;
`

export const IconImg = styled.img`
  width: 20px;
  margin: 0 5px;
`

export const EditBuild = styled.span`
  cursor: pointer;
  color: ${COLOR.LINK};
  border-bottom: 1px solid ${COLOR.LINK};
`

export const Main = styled.main`
  flex: 1 1 auto;
`

export const MainTitle = styled.h3`
  font-weight: 700;
  margin-top: 0;
  font-size: 16px;
`

export const MainContent = styled.div`
  font-size: 16px;

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
  color: ${COLOR.LINK};
  padding: 0;
  font-size: 16px;
`

export const Blueprint = styled.div`
  margin-top: 10px;
  background: ${COLOR.CODE};
  padding: 16px;
`

export const BlueprintData = styled.textarea`
  word-wrap: break-word;
  max-height: 400px;
  overflow-y: scroll;
  margin-top: 12px;
  background: transparent;
  color: ${COLOR.PURPLE900};
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
    background: ${COLOR.PURPLE900};
  }

  &.is-selected {
    font-weight: 700;
  }

  &.is-selected::after {
    height: 3px;
    background: ${COLOR.PURPLE900};
  }
`
