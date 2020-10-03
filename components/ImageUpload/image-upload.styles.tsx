import styled from "styled-components"
import { Plus } from "../../icons/plus"

export const ImageUploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const UploadZone = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 248px;
  height: 248px;
  border: 6px solid #67469b;
  border-radius: 10px;
  overflow-y: hidden;
  overflow-y: hidden;
  margin: 0 auto;
  cursor: pointer;

  .has-image & {
    height: auto;
  }

  &:active,
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #40a9ff !important;
  }

  &:hover {
    background: #ebebeb;
  }

  &:hover::after {
    content: "";
    position: absolute;
    border-radius: 3px;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border: 2px dashed #67469b;
  }

  .has-image &:hover::after {
    border-color: #fff;
  }
`

export const ImagePreview = styled.img`
  display: block;
  width: 100%;
`

export const StyledPlusIcon = styled(Plus)`
  width: 90px;
  height: 90px;
`

export const Hint = styled.div`
  position: absolute;
  bottom: 16px;
  color: #67469b;
  font-size: 14px;
  letter-spacing: 0.05em;
`

export const DeleteButtonWrapper = styled.div`
  margin: 16px 0;
`

export const DeleteButton = styled.button`
  background: #c20e0e;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  &:hover {
    background: #9d1111;
  }
`
