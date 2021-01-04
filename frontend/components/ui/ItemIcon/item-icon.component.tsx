import * as React from "react"
import startCase from "lodash/startCase"
import { IIcon } from "../../../types"
import * as SC from "./item-icon.styles"

interface IItemIconProps {
  name: IIcon["name"]
  type?: IIcon["type"]
}

const ItemIcon: React.FC<IItemIconProps> = (props) => {
  const name = React.useMemo(() => {
    switch (props.name) {
      case "rail":
        return "straight-rail"
      default:
        return props.name
    }
  }, [props.name])

  const type = startCase(props.type)

  return (
    <SC.ItemIconWrapper
      {...props}
      src={`https://api.local.factorio.tech/assets/icon/64/${type}/${name}.png`}
    />
  )
}

export default ItemIcon
