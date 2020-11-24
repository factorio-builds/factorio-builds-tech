import cx from "classnames"
import * as SC from "./checkbox.styles"

interface ICheckboxProps {
  id: string
  label: string
  prefix: JSX.Element
  value: React.ReactText
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  inline?: boolean
}

const Checkbox: React.FC<ICheckboxProps> = ({
  id,
  label,
  prefix,
  value,
  checked,
  onChange,
  inline,
}) => {
  return (
    <SC.CheckboxWrapper className={cx({ "is-checked": checked })}>
      <SC.HiddenCheckbox
        id={id}
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
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
    </SC.CheckboxWrapper>
  )
}

Checkbox.defaultProps = {
  inline: false,
}

export default Checkbox
