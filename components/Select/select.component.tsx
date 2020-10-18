import * as React from "react"
import ReactSelect, { Props as ReactSelectProps } from "react-select"
import { FieldProps } from "formik"
import { COLOR } from "../../design/tokens/color"

interface ISelect extends ReactSelectProps, FieldProps {
  id: string
  placeholder: string
}

const Select: React.FC<ISelect> = ({ field, form, ...props }) => {
  const isTouched = form.touched[field.name]
  const error = isTouched && form.errors[field.name]

  return (
    <ReactSelect
      placeholder={props.placeholder}
      // @ts-ignore
      options={props.options}
      menuPlacement="auto"
      onChange={(fieldValue) => {
        // @ts-ignore
        form.setFieldValue(field.name, fieldValue.value)
      }}
      styles={{
        control: (provided, state) => {
          const focusedShadow = `0 0 0 3px ${COLOR.FOCUSED}`
          return {
            ...provided,
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: 1.8,
            padding: "1px 13px",
            border: "2px solid",
            borderColor: `${error ? COLOR.DANGER : COLOR.GREY300} !important`,
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
        valueContainer: (provided) => ({
          ...provided,
          padding: 0,
        }),
        placeholder: (provided) => ({
          ...provided,
          color: "#bbb",
          margin: 0,
        }),
        menu: (provided) => ({
          ...provided,
          marginTop: "-2px",
          border: "2px solid",
          borderColor: COLOR.GREY300,
          borderTop: "none",
          borderRadius: 0,
          padding: "6px",
        }),
        indicatorSeparator: () => ({
          display: "none",
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          color: COLOR.GREY300,
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
          fontSize: "18px",
          fontWeight: 400,
          lineHeight: "22px",
          padding: "4px 8px",
          background: state.isSelected
            ? `${COLOR.SELECTED} !important`
            : state.isFocused
            ? `${COLOR.FOCUSED} !important`
            : "none",
          color: state.isSelected
            ? "#fff !important"
            : state.isFocused
            ? "#000"
            : provided.color,
          "&:hover": {
            background: COLOR.FOCUSED,
            color: "#000",
          },
        }),
      }}
    />
  )
}

export default Select
