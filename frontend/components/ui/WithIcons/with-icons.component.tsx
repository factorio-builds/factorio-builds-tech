import React from "react"
import ItemIcon from "../ItemIcon"
import useParseRichText from "./useParseRichText.hook"
import * as SC from "./with-icons.styles"

interface IWithIcons {
  input: string
  prefix?: JSX.Element
}

function WithIcons(props: IWithIcons): JSX.Element {
  const parts = useParseRichText(props.input)

  const formatted = React.useMemo(() => {
    if (!props.input) {
      return "[unnamed]"
    }

    return parts.map((part, index) => {
      if (part.type === "text") {
        return <span key={index}>{part.value}</span>
      }

      return <ItemIcon key={index} type="item" name={part.value} />
    })
  }, [props.input])

  return (
    <SC.WithIconsWrapper>
      {props.prefix} {formatted}
    </SC.WithIconsWrapper>
  )
}

export default WithIcons
