import React from "react"
import ItemIcon from "../ItemIcon"
import * as SC from "./with-icons.styles"

interface IWithIcons {
  input: string
  prefix?: JSX.Element
}

function WithIcons(props: IWithIcons): JSX.Element {
  const formatted = React.useMemo(() => {
    const regex = new RegExp(/(\[item=[A-z-]+\])/, "gi")
    const itemRegex = new RegExp(/\[item=([A-z-]+)\]/, "i")
    const parts = props.input.split(regex).filter(Boolean)

    return parts.map((part, index) => {
      if (!part.match(regex)) {
        return <span key={index}>{part}</span>
      }

      const match = part.match(itemRegex)
      if (!match || !match[1]) {
        return <span key={index}>{part}</span>
      }

      return <ItemIcon key={index} itemName={match[1]} />
    })
  }, [props.input])

  return (
    <SC.WithIconsWrapper>
      {props.prefix} {formatted}
    </SC.WithIconsWrapper>
  )
}

export default WithIcons
