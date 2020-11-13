import * as React from "react"
import * as SC from "./item-icon.styles"

interface IItemIconProps {
  itemName: string
}

const ItemIcon: React.FC<IItemIconProps> = (props) => {
  const iconSrc = `https://d3s5hh02rbjbr5.cloudfront.net/img/icons/large/${props.itemName}.png`

  return <SC.ItemIconWrapper src={iconSrc} />
}

export default ItemIcon
