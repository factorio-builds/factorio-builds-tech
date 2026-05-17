import cx from "classnames"
import * as S from "./radio.styles"

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
  return (
    <S.RadioWrapper className={cx({ "is-checked": checked })}>
      <S.HiddenRadio
        id={id}
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <S.Label htmlFor={id} className={cx({ "is-inline": inline })}>
        {checked}
        <S.Square />
        {label && (
          <S.Text>
            {prefix && <S.Prefix>{prefix}</S.Prefix>}
            {label}
          </S.Text>
        )}
      </S.Label>
    </S.RadioWrapper>
  )
}

Radio.defaultProps = {
  inline: false,
}

export default Radio
