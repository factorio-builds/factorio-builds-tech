import React from "react"
import * as S from "./tooltip.styles"

interface ITooltipProps {
  content: JSX.Element | React.ReactText
}

const Tooltip: React.FC<ITooltipProps> = ({ children, content }) => {
  return (
    <S.TooltipWrapper>
      {children}
      <S.TooltipContent>{content}</S.TooltipContent>
    </S.TooltipWrapper>
  )
}

export default Tooltip
