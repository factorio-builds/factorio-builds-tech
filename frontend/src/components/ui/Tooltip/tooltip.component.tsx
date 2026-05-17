import React from "react"
import * as S from "./tooltip.styles"

interface ITooltipProps {
  children: React.ReactNode
  content: React.ReactNode
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
