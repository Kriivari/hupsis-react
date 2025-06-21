import React, { useEffect, useState } from "react"
import { Button, Dialog, DialogTrigger, DialogTitle, DialogContent, DialogSurface, DialogBody, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, makeStyles, tokens } from "@fluentui/react-components"
import { GuestRegular } from "@fluentui/react-icons"
import { EventData, LogEntryData } from "../services/models"
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
  idCell: {
    width: "50px",
    maxWidth: "50px",
  },
  timeCell: {
    width: "80px",
    maxWidth: "80px",
  },
  saveDialog: {
    width: "250px",
    maxWidth: "250px",
  }
})

export const LogList: React.FC<Props> = ({event}) => {
  const classes = useStyles()
  const [listOpen, setListOpen] = useState(false)
  const [logEntries, setLogEntries] = useState([] as LogEntryData[])

  const editLogEntry = (id: any) => {
    const entry = logEntries[id-1]
    setListOpen(false)
  }

  useEffect(() => {
    getEvent(event.id).then(data => {
      setLogEntries(data.data.log_entries)
    })
  }, [])
  
  return (
     <Dialog open={listOpen} onOpenChange={(event, data) => { setListOpen(data.open) }}>
        <DialogTrigger><Button appearance="secondary" className={classes.root} icon={<GuestRegular />}/></DialogTrigger>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{strings.log_entries}
              <DialogTrigger disableButtonEnhancement>
                <Button className={classes.headerButtons} appearance="secondary">{strings.close}</Button>
              </DialogTrigger>
            </DialogTitle>
            <DialogContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell className={classes.idCell}>ID</TableHeaderCell>
                    <TableHeaderCell className={classes.timeCell}>{strings.time}</TableHeaderCell>
                    <TableHeaderCell>{strings.reason}</TableHeaderCell>
                    <TableHeaderCell>{strings.log_user}</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logEntries && logEntries.map((e) => (
                    <TableRow key={e.id} onClick={() => editLogEntry(e.id)}>
                      <TableCell className={classes.idCell}>{e.id}</TableCell>
                      <TableCell className={classes.timeCell}>{e.time.split(" ")[1]}</TableCell>
                      <TableCell>{e.reason}</TableCell>
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
