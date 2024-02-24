import React, { forwardRef } from "react"
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import fi from "date-fns/locale/fi"
import styles from "./Calendar.module.css"
import classnames from "classnames"
registerLocale("fi", fi)

interface Props {
  onChangeDate: React.Dispatch<React.SetStateAction<Date>>
  value: Date
  id: string
  disabled?: boolean
  readOnly?: boolean
  type?: CalendarType
}

type Children = React.HTMLProps<HTMLButtonElement>
type Ref = HTMLButtonElement
type CalendarType = "primary" | "disabled"

//const Calendar: React.FC<Props> = ({ onChangeDate, value, id }) => {
const Calendar: React.FC<Props> = props => {
  //forward reference to a button to avoid console warnings

  const className = classnames(styles.calendar, {
    [styles.calendar]: props.type === "primary",
    [styles.disabled]: props.type === "disabled"
  })

  const Input = forwardRef<Ref, Children>((props, ref) => (
    <button
      ref={ref}
      type="button"
      className={className}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  ))

  return (
    <DatePicker
      selected={props.value}
      onChange={(date: Date) => props.onChangeDate(date)}
      showTimeSelect
      dateFormat="Pp"
      locale="fi"
      key={props.value.toDateString()}
      id={props.id}
      customInput={<Input />}
      readOnly={props.readOnly}
      disabled={props.disabled}
    />
  )
}

export { Calendar }
