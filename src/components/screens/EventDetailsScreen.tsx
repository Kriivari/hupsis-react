import React, { Suspense } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "../../hooks"
import { ParticipantTable } from "../ParticipantTable"
import { formatDateSpan } from "./../../util"

export const EventDetailsScreen = () => {
  const id = useParams().id
  const events = useAppSelector(state => state.events)
  const event = events.events.find(r => r.id === Number(id))
  console.log(event)

  if (!event) return <div>error</div>

  const users = event.event_users.filter(u => u.role_id < 10)
  const notcomingUsers = event.event_users.filter(u => u.role_id === 16)
  
  const EventComponent = () => {
    return (
      <>
        <div><Header /></div>
        <div><Body /></div>
	{users.length > 0 ? (
          <div><ParticipantTable mobile={false} popup={false} editable={false} userId={-1} event={event} participants={users} notcoming={notcomingUsers}/></div>
	) : (
	  <div />
	)}
      </>
    )
  }

  const Header = () => {
    return (
      <h1>
        {event && event.name},{" "}
        {event && formatDateSpan(event.start_time, event.end_time)}
      </h1>
    )
  }

  const Body = () => {
    return (
      <div>{event && event.location}</div>
    )
  }

  return (
    <Suspense fallback="loading...">
      <div style={{ padding: "2rem" }}>
        <EventComponent />
      </div>
    </Suspense>
  )
}

export default EventDetailsScreen