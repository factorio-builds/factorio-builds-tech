import { lighten } from "polished"
import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"
import ItemIcon from "../../ui/ItemIcon"
import Stacker from "../../ui/Stacker"

export const BuildHeader = styled.header`
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${COLOR.PURPLE500};
  color: ${COLOR.PURPLE700};
`

export const BuildTitle = styled.h2`
  ${getTypo(ETypo.PAGE_HEADER)};
  color: ${COLOR.PURPLE900};
  margin: 0;
`

export const BuildHeaderMeta = styled.div`
  font-weight: 700;
  display: flex;
  align-items: center;

  img {
    width: 20px;
    margin-right: 8px;
  }
`

export const BuildImage = styled.div`
  border: 4px solid ${COLOR.PURPLE300};
  border-radius: 4px;

  img {
    display: block;
    width: 100%;
  }
`

export const CopyClipboardWrapper = styled.div`
  margin-bottom: 16px;
`

export const WithRequiredItem = styled(Stacker)`
  ${getTypo(ETypo.METADATA)};
  align-items: center;
`

export const BlueprintItem = styled(Stacker)`
  align-items: center;
`

export const IconImg = styled(ItemIcon)`
  width: 20px;
`

export const EditBuild = styled.span`
  align-self: flex-start;
  cursor: pointer;
  color: ${COLOR.LINK};
  border-bottom: 1px solid ${COLOR.LINK};

  &:hover {
    color: ${lighten(0.3, COLOR.LINK)};
    border-color: ${lighten(0.3, COLOR.LINK)};
  }
`

export const BlueprintData = styled.textarea`
  flex: 1 0 auto;
  box-sizing: border-box;
  word-wrap: break-word;
  max-height: 400px;
  overflow-y: scroll;
  margin-top: 12px;
  background: transparent;
  color: ${COLOR.PURPLE900};
  border: none;
  width: 100%;
`

export const TabsWrapper = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
`

export const TabsContent = styled(Stacker)`
  display: flex;
  flex: 1 0 auto;
  margin-top: 16px;
`

export const TabsContentInner = styled.div`
  flex: 1 1 auto;
  display: flex;
`

export const TabsAside = styled.aside`
  flex: 0 0 400px;
  width: 400px;
`

export const Tab = styled.button`
  ${getTypo(ETypo.BUTTON)};
  background: none;
  border: none;
  padding: 0;
  color: ${COLOR.PURPLE900};
  border-bottom: 2px solid transparent;
  cursor: pointer;

  &:hover {
    border-color: ${COLOR.PURPLE900};
  }

  &.is-active {
    font-weight: 700;
    border-color: ${COLOR.PURPLE900};
  }
`

export const TabWrapper = styled.div`
  display: none;

  &.is-active {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
  }
`

export const Description = styled.div`
  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }
`
