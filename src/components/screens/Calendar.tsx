import React, { useState } from "react"
import { tokens } from "@fluentui/react-components"
import { Calendar, Event, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import { useAppSelector, useAppDispatch } from "./../../hooks"
import { EventPopup } from "./../EventPopup"
import { getMore } from "./../../services/events"
import { EventData } from "./../../services/models"
import { getDate, eventBackground } from "./../../util"
import { strings } from "./../../localization"

require("moment/locale/fi.js")

const calendarStyles = {
  height: "500px",
}

export const EventCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState({} as EventData)
  const [modalState, setModalState] = useState(false)
  const events: Event[] = []

  const dispatch = useAppDispatch()
  const appSelector = useAppSelector
  const startDates = appSelector(state => state.events.startDates)
  appSelector(state => state.events).events.forEach((event) => {
    const sd = getDate(event.start_time)
    const ed = getDate(event.end_time)
    events.push({title: event.name, start: sd, end: ed, resource: event})
  })

  const user = appSelector(state => state.login).id

  const handleSelectedEvent = (event: Event) => {
    setSelectedEvent(event.resource)
    setModalState(true)
  }

  const handleRangeChange = (e: Date[] | {start: Date, end: Date}) => {
    if (Array.isArray(e)) {
      if (e[0].getTime() < (new Date()).getTime() && !startDates.includes(e[0].toISOString().split("T")[0])) {
        dispatch(getMore({start: e[0], end: e[1]}))
      }
    } else if (e.start.getTime() < (new Date()).getTime() && !startDates.includes(e.start.toISOString().split("T")[0])) {
      dispatch(getMore({start: e.start, end: e.end}))
    }
  }

  const styleEvent = (event: Event, start: Date, end: Date, isSelected: boolean) => {
    const color = eventBackground(user, event.resource)
    return { style: {backgroundColor: color, color: tokens.colorNeutralForeground1}}
  }

  return (
    <>
      <EventPopup event={selectedEvent} modalState={modalState} setModalState={setModalState} />
      <Calendar
        views={{ month: true, week: true, day: true, agenda: false, }}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        defaultDate={moment().toDate()}
        localizer={momentLocalizer(moment)}
        style={calendarStyles}
	onSelectEvent={(e) => handleSelectedEvent(e)}
	onRangeChange={(e) => handleRangeChange(e)}
	eventPropGetter={(styleEvent)}
	scrollToTime={moment().startOf('day').add(12, 'hours').toDate()}
	messages={{
	  next: ">>",
	  previous: "<<",
	  today: strings.today,
	  month: strings.month,
	  week: strings.week,
	  day: strings.day
	}}
      />
    </>
  )
}

export default EventCalendar
