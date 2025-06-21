import React, { useState } from "react"
import { useAppSelector, useAppDispatch } from "./../hooks"
import { Button, Dialog, DialogTrigger, DialogTitle, DialogContent, DialogSurface, DialogBody, DialogActions, Input, Table, TableBody, TableCell, TableRow, Textarea, makeStyles, tokens } from "@fluentui/react-components"
import { NoteAddRegular, CheckmarkFilled, DismissFilled } from "@fluentui/react-icons"
import { EventData, EventLogEntryData } from "../services/models"
import { getEvent, doEventLog } from "./../services/events"
import { strings } from "./../localization"
import { formatHupsisTime } from "./../util"

interface Props {
  event: EventData
  short: boolean
}

const useStyles = makeStyles({
  root: {
    marginTop: tokens.spacingVerticalS,
    marginRight: tokens.spacingHorizontalS,
  },
  headerButtons: {
    marginLeft: tokens.spacingHorizontalMNudge,
    float: "right",
  },
  dropdown: {
    minWidth: "180px",
  },
  input: {
    minWidth: "180px",
  },
})

export const EventLogEntry: React.FC<Props> = ({event, short}) => {
  const classes = useStyles()
  const appSelector = useAppSelector
  const appDispatch = useAppDispatch()
  const login = appSelector(state => state.login)
  const [entry, setEntry] = useState("")
  const [user, setUser] = useState(login.last_name + " " + login.first_name)
  const [time, setTime] = useState(formatHupsisTime(new Date()))

  const doSave = () => {
    appDispatch(doEventLog({event_id: event.id, entry, user, time}))
  }

  return (
    <Dialog>
      <DialogTrigger><Button appearance="secondary" className={classes.root} icon={<NoteAddRegular/>}/></DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{strings.add_event_log_entry}
            <DialogTrigger disableButtonEnhancement>
              <Button className={classes.headerButtons} appearance="secondary" icon={<DismissFilled/>}/>
            </DialogTrigger>
	    <DialogTrigger>
              <Button className={classes.headerButtons} appearance="primary" onClick={doSave} disabled={entry === ""} icon={<CheckmarkFilled />}/>
	    </DialogTrigger>
          </DialogTitle>
          <DialogContent>
            <Table>
              <TableBody>
	        <TableRow>
	          <TableCell>{strings.entry}</TableCell>
	          <TableCell><Textarea value={entry} onChange={(e) => {setEntry(e.target.value)}} className={classes.input}/></TableCell>
	        </TableRow>
	        <TableRow>
	          <TableCell>{strings.log_user}</TableCell>
	          <TableCell><Input value={user} onChange={(e) => {setUser(e.target.value)}} className={classes.input}/></TableCell>
		</TableRow>
	        <TableRow>
	          <TableCell>{strings.log_time}</TableCell>
	          <TableCell><Input value={time} onChange={(e) => {setTime(e.target.value)}} className={classes.input}/></TableCell>
        	</TableRow>
              </TableBody>
            </Table>
          </DialogContent>
	</DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
