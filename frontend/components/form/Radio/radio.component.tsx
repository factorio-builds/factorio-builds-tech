import { useRef } from "react"
import { useRadioGroup, useRadio } from "@react-aria/radio"
import cx from "classnames"
import * as SC from "./radio.styles"

interface IRadioProps {
  id: string
  label: string
  prefix?: JSX.Element
  value: React.ReactText
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  inline?: boolean
}

const Radio: React.FC<IRadioProps> = ({
  id,
  label,
  prefix,
  value,
  checked,
  onChange,
  inline,
}) => {
  // const state = React.useContext(RadioContext)
  const ref = useRef<HTMLInputElement>(null)
  const { inputProps } = useRadio(
    props,
    {
      name: value,
    },
    ref
  )

  return (
    <SC.RadioWrapper className={cx({ "is-checked": checked })}>
      <SC.HiddenRadio
        id={id}
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        ref={ref}
      />
      <SC.Label htmlFor={id} className={cx({ "is-inline": inline })}>
        {checked}
        <SC.Square />
        {label && (
          <SC.Text>
            {prefix && <SC.Prefix>{prefix}</SC.Prefix>}
            {label}
          </SC.Text>
        )}
      </SC.Label>
    </SC.RadioWrapper>
  )
}

Radio.defaultProps = {
  inline: false,
}

export default Radio
