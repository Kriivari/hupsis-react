import React from "react"
import { Card, Divider, Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell } from "@fluentui/react-components"
import { Signup } from "./Signup"
import { EventData, EventUserData, EventShiftData } from "../services/models"
import { formatTimeSpan, sortByTimeAndName } from "./../util"
import { strings } from "./../localization"

interface ParticipantProps {
  mobile: boolean
  popup: boolean
  editable: boolean
  userId: number
  event: EventData
  participants: EventUserData[]
  notcoming: EventUserData[]
}

const ParticipantTable: React.FC<ParticipantProps> = ({ mobile, popup, editable, userId, event, participants, notcoming }) => {
console.log(event.name, notcoming)
  return editable ? (
      <Card>
        { event.event_shifts.map((shift: EventShiftData) => shift.event_users.map((signup: EventUserData) => (
	  <div key={signup.id + "-top"}>
            <Signup key={signup.id} event={event} shift={shift} signup={signup} multishift={(event.event_shifts.length > 1)} isOpen={editable} mobile={mobile} popup={popup} editable={editable} />
	    <Divider key={signup.id + "-div"}/>
	  </div>
        )))}
      </Card>
    ) : (
      <Table>
        <TableHeader>
          <TableHeaderCell>{ strings.name }</TableHeaderCell>
          <TableHeaderCell>{ strings.time }</TableHeaderCell>
          <TableHeaderCell>{ strings.group }</TableHeaderCell>
          <TableHeaderCell>{ strings.comments }</TableHeaderCell>
	  <TableHeaderCell />
        </TableHeader>

        <TableBody>
          {sortByTimeAndName(participants).map(row => (
            <TableRow key={row.id}>
              <TableCell>
                {row.user ? row.user.last_name + " " + row.user.first_name : row.comments}
              </TableCell>
              <TableCell>
                {formatTimeSpan(row.start_time, row.end_time)}
              </TableCell>
	      <TableCell>
	        {row.user && row.user.home_groups_light && row.user.home_groups_light.map(g => g.name).join(",")}
	      </TableCell>
	      <TableCell>
	        {row.user ? row.comments : ""}
	      </TableCell>
	      <TableCell>
	        {row.role_id === 5 ? strings.leader : row.trainee ? strings.trainee : ""}
	        {row.confirmed ? ((row.role_id === 5 || row.trainee ? ", " : "") + strings.confirmed) : ""}
	      </TableCell>
            </TableRow>
          ))}
          {sortByTimeAndName(notcoming).filter((s) => !s.user || s.user.id !== userId).map(row => (
            <TableRow key={row.id}>
              <TableCell className='bg-secondary'>
                <p>{row.user ? row.user.last_name + " " + row.user.first_name : row.comments}</p>
              </TableCell>
              <TableCell className='bg-secondary'>
                <p>{formatTimeSpan(row.start_time, row.end_time)}</p>
              </TableCell>
	      <TableCell />
	      <TableCell />
	      <TableCell />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
}

export { ParticipantTable }
