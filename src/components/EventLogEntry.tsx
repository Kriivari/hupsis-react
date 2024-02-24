import React, { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "./../hooks"
import { Button, Dialog, DialogTrigger, DialogTitle, DialogContent, DialogSurface, DialogBody, DialogActions, Input, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, makeStyles, tokens } from "@fluentui/react-components"
import { EventData, EventLogEntryData } from "../services/models"
import { getEvent, doEventLog } from "./../services/events"
import { strings } from "./../localization"
import { formatHupsisTime } from "./../util"

interface Props {
  event: EventData
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

export const EventLogEntry: React.FC<Props> = ({event}) => {
  const classes = useStyles()
  const appSelector = useAppSelector
  const appDispatch = useAppDispatch()
  const login = appSelector(state => state.login)
  const [entry, setEntry] = useState("")
  const [user, setUser] = useState(login.last_name + " " + login.first_name)
  const [time, setTime] = useState(formatHupsisTime(new Date()))
  const [logEntries, setLogEntries] = useState([] as EventLogEntryData[])

  const doSave = () => {
    appDispatch(doEventLog({event_id: event.id, entry, user, time}))
  }

  useEffect(() => {
    getEvent(event.id).then(data => {
      setLogEntries(data.data.event_log_entries)
    })
  }, [])
  
  return (
  <>
    <Dialog>
      <DialogTrigger><Button appearance="secondary" className={classes.root}>{strings.event_log_entry} / {event.name}</Button></DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{strings.add_event_log_entry}
          </DialogTitle>
          <DialogContent>
            <Table>
              <TableBody>
	        <TableRow>
	          <TableCell>{strings.entry}</TableCell>
	          <TableCell><Input value={entry} onChange={(e) => {setEntry(e.target.value)}} className={classes.input}/></TableCell>
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
          <DialogActions>
	    <DialogTrigger>
              <Button appearance="primary" onClick={doSave} disabled={entry === ""}>{strings.save}</Button>
	    </DialogTrigger>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">{strings.close}</Button>
            </DialogTrigger>
          </DialogActions>
	</DialogBody>
      </DialogSurface>
    </Dialog>
    <Dialog>
      <DialogTrigger><Button appearance="secondary" className={classes.root}>{strings.event_log_entries}</Button></DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{strings.event_log_entries}
            <DialogTrigger disableButtonEnhancement>
              <Button className={classes.headerButtons} appearance="secondary">{strings.close}</Button>
            </DialogTrigger>
          </DialogTitle>
          <DialogContent>
            <Table>
	      <TableHeader>
                <TableHeaderCell>ID</TableHeaderCell>
	        <TableHeaderCell>{strings.time}</TableHeaderCell>
	        <TableHeaderCell>{strings.entry}</TableHeaderCell>
	        <TableHeaderCell>{strings.log_user}</TableHeaderCell>
	      </TableHeader>
              <TableBody>
		{ logEntries && logEntries.map((e) => (
		  <TableRow>
		    <TableCell>{e.id}</TableCell>
		    <TableCell>{e.time.split(" ")[1]}</TableCell>
		    <TableCell>{e.entry}</TableCell>
		    <TableCell>{e.user}</TableCell>
		  </TableRow>
		))}
	      </TableBody>
	    </Table>
	  </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  </>
  )
}
