import * as React from "react"
import getConfig from "next/config"
import { IIcon } from "../../../types/models"
import * as S from "./item-icon.styles"

const { publicRuntimeConfig } = getConfig()

interface IItemIconProps {
  name: IIcon["name"]
  type: IIcon["type"]
}

const ItemIcon: React.FC<IItemIconProps> = (props) => {
  return (
    <S.ItemIconWrapper
      {...props}
      data-testid="item-icon"
      src={`${publicRuntimeConfig.cdnUrl}/icon/64/${props.type}/${props.name}.png`}
    />
  )
}

export default ItemIcon
