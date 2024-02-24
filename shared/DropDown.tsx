import React from "react"
import styles from "./Dropdown.module.css"
import labelStyles from "../screens/Overview.module.css"
import classnames from "classnames"

type SelectType = "primary" | "disabled"

interface SelectProps {
  disabled?: boolean
  multiple?: boolean
  required?: boolean
  defaultValue?: string | number | string[] | undefined
  onChange?: (n?: any) => void
  label?: string
  id?: string
  type: SelectType
}

interface OptionProps {
  disabled?: boolean
  selected?: boolean
  value: any
  key: any
}

const Option: React.FC<OptionProps> = props => {
  return (
    <option {...props} className={styles.option}></option>
  )
}

const Select: React.FC<SelectProps> = props => {
  const className = classnames(styles.select, {
    [styles.select]: props.type === "primary",
    [styles.disabled]: props.type === "disabled"
  })
  return (
    <>
      {props.label && (
        <label className={labelStyles.label} htmlFor={props.id}>
          {props.label}
        </label>
      )}
      <select className={className} {...props}></select>
    </>
  )
}

export { Select, Option }
