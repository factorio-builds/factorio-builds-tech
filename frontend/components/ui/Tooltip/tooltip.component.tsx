import React from "react"
import * as SC from "./tooltip.styles"

interface ITooltipProps {
  content: JSX.Element | React.ReactText
}

const Tooltip: React.FC<ITooltipProps> = ({ children, content }) => {
  return (
    <SC.TooltipWrapper>
      {children}
      <SC.TooltipContent>{content}</SC.TooltipContent>
    </SC.TooltipWrapper>
  )
}

export default Tooltip
