import { useRef } from "react"
import { useCheckbox } from "@react-aria/checkbox"
import { VisuallyHidden } from "@react-aria/visually-hidden"
import { useToggleState } from "@react-stately/toggle"
import cx from "classnames"
import * as S from "./checkbox.styles"

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
  const state = useToggleState({ ...props, isSelected: props.checked })
  const ref = useRef<HTMLInputElement>(null)
  const { inputProps } = useCheckbox(props, state, ref)

  return (
    <S.CheckboxWrapper className={cx({ "is-checked": state.isSelected })}>
      <VisuallyHidden>
        <input id={props.id} {...inputProps} ref={ref} />
      </VisuallyHidden>
      <S.Label htmlFor={props.id} className={cx({ "is-inline": props.inline })}>
        {state.isSelected}
        <S.Square />
        {props.label && (
          <S.Text>
            {props.prefix && <S.Prefix>{props.prefix}</S.Prefix>}
            {props.label}
          </S.Text>
        )}
      </S.Label>
    </S.CheckboxWrapper>
  )
}

Checkbox.defaultProps = {
  inline: false,
}

export default Checkbox
