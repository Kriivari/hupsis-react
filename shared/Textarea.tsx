import styles from "./Textarea.module.css"
import React, { ChangeEvent } from "react"

interface Props {
  value: string
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  id?: string
  name?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  autoFocus?: boolean
  rows?: number
  cols?: number
  label?: string
}

const Textarea: React.FC<Props> = props => {
  return (
    <>
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      <textarea {...props} className={styles.textarea} />
    </>
  )
}

export { Textarea }
