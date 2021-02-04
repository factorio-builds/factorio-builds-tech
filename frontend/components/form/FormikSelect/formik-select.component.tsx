import { useMemo } from "react"
import ReactSelect, { Props as ReactSelectProps } from "react-select"
import { FieldProps } from "formik"
import { COLOR } from "../../../design/tokens/color"

interface ISelect extends ReactSelectProps, FieldProps {
  id: string
  placeholder: string
}

const Select: React.FC<ISelect> = ({ field, form, ...props }) => {
  const isTouched = form.touched[field.name]
  const error = isTouched && form.errors[field.name]

  const value = useMemo(() => {
    if (!field.value || !props.options) {
      return null
    }

    return props.options.find((option) => option.value === field.value)
  }, [field.value])

  return (
    <ReactSelect
      placeholder={props.placeholder}
      options={props.options}
      menuPlacement="auto"
      onChange={(fieldValue) => {
        const value = fieldValue ? fieldValue.value : null
        form.setFieldValue(field.name, value)
      }}
      value={value}
      styles={{
        control: (provided, state) => {
          const focusedShadow = `0 0 0 3px ${COLOR.FOCUSED}`
          return {
            ...provided,
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: 1.8,
            padding: "1px 13px",
            background: COLOR.INPUT,
            border: "2px solid",
            borderColor: `${error ? COLOR.DANGER : COLOR.PURPLE500} !important`,
            borderRadius: 0,
            boxShadow: state.isFocused ? focusedShadow : "none",
            transition: "none",
            "&:hover": {
              boxShadow: state.isFocused
                ? focusedShadow
                : "0px 2px 8px rgba(0, 0, 0, 0.2)",
            },
          }
        },
        singleValue: (provided) => ({
          ...provided,
          display: "flex",
          alignItems: "center",
          color: COLOR.PURPLE700,
          "& img": {
            width: "20px",
            marginRight: "8px",
          },
        }),
        valueContainer: (provided) => ({
          ...provided,
          padding: 0,
        }),
        placeholder: (provided) => ({
          ...provided,
          color: COLOR.PURPLE500,
          margin: 0,
        }),
        menu: (provided) => ({
          ...provided,
          marginTop: "-2px",
          border: "2px solid",
          background: COLOR.INPUT,
          borderColor: COLOR.PURPLE500,
          boxShadow: `inset 0 1px 0 0 ${COLOR.PURPLE300}`,
          borderTop: "none",
          borderRadius: 0,
          padding: "6px",
        }),
        indicatorSeparator: () => ({
          display: "none",
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          color: COLOR.PURPLE500,
          paddingRight: 0,
        }),
        input: (provided) => ({
          ...provided,
          margin: "2px 0",
        }),
        menuList: (provided) => ({
          ...provided,
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }),
        option: (provided, state) => ({
          ...provided,
          display: "flex",
          alignItems: "center",
          fontSize: "18px",
          fontWeight: 400,
          lineHeight: "22px",
          padding: "4px 8px",
          background: state.isSelected
            ? `${COLOR.SELECTED} !important`
            : state.isFocused
            ? `${COLOR.FOCUSED} !important`
            : "none",
          color:
            state.isSelected || state.isFocused
              ? "#241A34 !important"
              : COLOR.PURPLE700,
          "&:hover": {
            background: COLOR.FOCUSED,
            color: "#241A34 !important",
          },
          "& img": {
            width: "20px",
            marginRight: "8px",
          },
        }),
      }}
    />
  )
}

export default Select
