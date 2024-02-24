import React, { ChangeEvent } from "react"
import styles from "./Input.module.css"
import classNames from "classnames"

type InputType = "button" | "text" | "submit" | "disabled"

interface Props {
  className?: InputType
  type: string
  value: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  id?: string
  name?: string
  width?: number
  height?: number
  size?: number
  required?: boolean
  disabled?: boolean
  label?: string
}

const Input: React.FC<Props> = props => {
  const className = classNames(styles.input, {
    [styles.submit]: props.className === "submit",
    [styles.text]: props.className === "text",
    [styles.disabled]: props.className === "disabled"
  })

  return (
    <>
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      <input {...props} className={className} type={props.type} />
    </>
  )
}

export { Input }
