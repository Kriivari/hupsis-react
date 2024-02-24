import React, { useState } from "react"
import { Subtitle1, Card, CardHeader, useRestoreFocusTarget, makeStyles } from "@fluentui/react-components"
import { Calendar24Filled, Location24Filled, PeopleCommunity24Filled } from "@fluentui/react-icons"
import { EventPopup } from "./EventPopup"
import { useAppSelector } from "./../hooks"
import { getDate, formatShortTimeSpan } from "./../util"
import { strings } from "./../localization"

interface Props {
  type: number
  mobile: boolean
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  mobile: {
    display: "none",
  },
})

export const NextEvent: React.FC<Props> = ({type, mobile}) => {
  const classes = useStyles()
  const appSelector = useAppSelector
  const login  = appSelector(state => state.login)
  const nextEvents = appSelector(state => state.events.events).filter(e => e.type_id === type && e.event_users.filter(eu => eu.user && eu.user.id === login.id && eu.role_id < 10).length > 0 && getDate(e.end_time).getTime() > (new Date().getTime()))
  const nextSignups = nextEvents && nextEvents.length > 0 ? nextEvents[0].event_users.filter(eu => eu.user && eu.user.id === login.id && eu.role_id < 10) : []
  const [modalState, setModalState] = useState(false)
  const restoreFocusTargetAttribute = useRestoreFocusTarget()

  return nextEvents.length === 0 ? (
    <div/>
    ) : (
    <>
    <Card {...restoreFocusTargetAttribute} onClick={() => {setModalState(true)}} className={classes.root}>
      <CardHeader header={mobile ? <b>{(type === 1 ? strings.next_event : strings.next_practice)}</b> : <Subtitle1>{type === 1 ? strings.next_event : strings.next_practice}</Subtitle1>}/>
      <div>
        <div>
	  <PeopleCommunity24Filled />
	  {nextEvents[0].name}
	</div>
        <div>
	  <Calendar24Filled />
	  {nextSignups && nextSignups.length > 0 ? formatShortTimeSpan(nextSignups[0].start_time, nextSignups[0].end_time) : formatShortTimeSpan(nextEvents[0].start_time, nextEvents[0].end_time)}
	</div>
        <div className={mobile ? classes.mobile : ""}>
	  <Location24Filled />
	  {nextEvents[0].location + (nextEvents[0].city ? ", " + nextEvents[0].city : "")}
	</div>
      </div>
    </Card>
    <EventPopup event={nextEvents[0]} modalState={modalState} setModalState={setModalState} />
    </>
    )
}
