import * as React from "react"
import * as SC from "./item-icon.styles"

interface IItemIconProps {
  itemName: string
}

const ItemIcon: React.FC<IItemIconProps> = (props) => {
  const nameFix = React.useMemo(() => {
    switch (props.itemName) {
      case "rail":
        return "straight-rail"
      default:
        return props.itemName
    }
  }, [props.itemName])

  const iconSrc = `https://d3s5hh02rbjbr5.cloudfront.net/img/icons/large/${nameFix}.png`

  return <SC.ItemIconWrapper src={iconSrc} />
}

export default ItemIcon
