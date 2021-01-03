import styled from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"
import Lamp from "../../../icons/lamp"

export const ImageUploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const TopRow = styled.div`
  display: flex;
  align-items: center;
`

// TODO: extract
export const Label = styled.label`
  ${getTypo(ETypo.FORM_LABEL)};
  color: ${COLOR.PURPLE900};
`

export const SwapImage = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  padding: 0;
  color: ${COLOR.BLUE500};
  border-bottom: 1px solid ${COLOR.BLUE500};
  cursor: pointer;

  &:hover {
    color: ${COLOR.BLUE700};
    border-bottom-color: ${COLOR.BLUE700};
  }
`

export const UploadZone = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 300px;
  height: 377px;
  border: 2px solid ${COLOR.PURPLE500};
  overflow-y: hidden;
  overflow-y: hidden;
  margin: 0 auto;
  cursor: pointer;
  background: ${COLOR.INPUT};
  padding: 8px;

  .has-image & {
    height: auto;
  }

  &:active,
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #40a9ff !important;
  }

  &:hover::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.25);
  }

  .has-image &:hover::after {
    border-color: #fff;
  }
`

export const ImagePreview = styled.img`
  display: block;
  width: 100%;
`

export const Hint = styled.div`
  ${getTypo(ETypo.FORM_INPUT)};
  position: relative;
  z-index: 1;
  color: ${COLOR.PURPLE700};
  letter-spacing: 0.05em;
`

export const NoImageBackdrop = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("/img/image-backdrop.jpg");
  background-size: cover;
  background-position: 50% 50%;
`

export const Recommended = styled.div`
  display: flex;
  align-items: center;
  background: #877599;
  color: ${COLOR.PURPLE700};
  padding: 14px 14px;
  font-size: 12px;
  margin-top: 7px;
`

export const StyledLamp = styled(Lamp)`
  flex: 0 0 23px;
  width: 23px;
  margin-right: 15px;
`

export const Feedback = styled.div`
  ${getTypo(ETypo.FORM_INPUT)};
  padding: 10px 0;

  svg {
    width: 15px;
    margin-right: 8px;
  }

  &.variant-positive {
    color: #68c06b;

    svg path {
      fill: #68c06b;
    }
  }

  &.variant-warning {
    color: #fde92e;

    svg path {
      fill: #fde92e;
    }
  }
`
