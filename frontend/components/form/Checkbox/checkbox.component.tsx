import { useRef } from "react"
import { useCheckbox } from "@react-aria/checkbox"
import { VisuallyHidden } from "@react-aria/visually-hidden"
import { useToggleState } from "@react-stately/toggle"
import cx from "classnames"
import * as SC from "./checkbox.styles"

interface ICheckboxProps {
  id: string
  label: string
  prefix?: JSX.Element
  value: string
  checked: boolean
  onChange: (isSelected: boolean) => void
  inline?: boolean
}

const Checkbox: React.FC<ICheckboxProps> = (props) => {
  const state = useToggleState(props)
  const ref = useRef<HTMLInputElement>(null)
  const { inputProps } = useCheckbox(props, state, ref)

  return (
    <SC.CheckboxWrapper className={cx({ "is-checked": state.isSelected })}>
      <VisuallyHidden>
        <input id={props.id} {...inputProps} ref={ref} />
      </VisuallyHidden>
      <SC.Label
        htmlFor={props.id}
        className={cx({ "is-inline": props.inline })}
      >
        {state.isSelected}
        <SC.Square />
        {props.label && (
          <SC.Text>
            {props.prefix && <SC.Prefix>{props.prefix}</SC.Prefix>}
            {props.label}
          </SC.Text>
        )}
      </SC.Label>
    </SC.CheckboxWrapper>
  )
}

Checkbox.defaultProps = {
  inline: false,
}

export default Checkbox
