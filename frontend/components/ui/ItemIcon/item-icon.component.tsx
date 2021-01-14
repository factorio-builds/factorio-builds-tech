import * as React from "react"
import startCase from "lodash/startCase"
import getConfig from "next/config"
import { IIcon } from "../../../types/models"
import * as SC from "./item-icon.styles"

const { publicRuntimeConfig } = getConfig()

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
      src={`${publicRuntimeConfig.apiUrl}/assets/icon/64/${type}/${name}.png`}
    />
  )
}

export default ItemIcon
