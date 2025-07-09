import React, { useEffect, useState } from "react"
import { Button, Dialog, DialogTrigger, DialogTitle, DialogContent, DialogSurface, DialogBody, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, makeStyles, tokens } from "@fluentui/react-components"
import { TextBulletListRegular } from "@fluentui/react-icons"
import { EventData, EventLogEntryData } from "../services/models"
import { getEvent } from "../services/events"
import { strings } from "../localization"

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

export const EventLogList: React.FC<Props> = ({event}) => {
  const classes = useStyles()
  const [logEntries, setLogEntries] = useState([] as EventLogEntryData[])

  useEffect(() => {
    getEvent(event.id).then(data => {
      setLogEntries(data.data.event_log_entries)
    })
  }, [event.id])
  
  return (
    <Dialog>
      <DialogTrigger><Button appearance="secondary" className={classes.root} icon={<TextBulletListRegular/>}/></DialogTrigger>
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
  )
}
