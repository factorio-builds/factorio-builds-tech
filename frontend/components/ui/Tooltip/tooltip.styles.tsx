import styled from "styled-components"

export const TooltipWrapper = styled.div`
  display: inline-flex;
  position: relative;
  cursor: help;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
  white-space: nowrap;
`

export const TooltipContent = styled.div`
  opacity: 0;
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: -10px;
  transition: all 0.15s;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(7px);
  padding: 7px;
  border-radius: 5px;
  width: max-content;
  max-width: 400px;

  ${TooltipWrapper}:hover & {
    opacity: 1;
    margin-top: 5px;
  }
`
