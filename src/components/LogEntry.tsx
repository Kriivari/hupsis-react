import React, { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "./../hooks"
import { Button, Dialog, DialogTrigger, DialogTitle, DialogContent, DialogSurface, DialogBody, DialogActions, Checkbox, Dropdown, Input, Option, Table, TableBody, TableCell, TableRow, makeStyles, tokens } from "@fluentui/react-components"
import { GuestAddRegular, CheckmarkFilled, DismissFilled } from "@fluentui/react-icons"
import { EventData } from "../services/models"
import { doLog } from "./../services/events"
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

export const LogEntry: React.FC<Props> = ({event, short}) => {
  const classes = useStyles()
  const appSelector = useAppSelector
  const appDispatch = useAppDispatch()
  const login = appSelector(state => state.login)
  const codes = appSelector(state => state.events.codes)
  const [formOpen, setFormOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [id, setId] = useState()
  const [age, setAge] = useState(strings.adult)
  const [reason, setReason] = useState("")
  const [details, setDetails] = useState("")
  const [firstaid, setFirstaid] = useState("")
  const [future, setFuture] = useState("")
  const [destination, setDestination] = useState("")
  const [medicine, setMedicine] = useState(false)
  const [form, setForm] = useState(false)
  const [notes, setNotes] = useState("")
  const [usage, setUsage] = useState("")
  const [user, setUser] = useState(login.last_name + " " + login.first_name)
  const [time, setTime] = useState(formatHupsisTime(new Date()))
  const currentLogId = appSelector((state) => state.events.currentLogId)

  const ageMap = [strings.child, strings.youth, strings.adult]
  const destinations = ["Ei", "Ensihoito", "Oma kyyti", "Tarvittaessa oma kyyti"]

  const reasonSelect = (e: any, data: any) => {
    setReason(data.optionValue || "")
    codes.forEach(code => {
      if (code.code === data.optionValue) {
        setFirstaid(code.firstaid)
      }
    })
  }
  
  const doSave = () => {
    appDispatch(doLog({event_id: event.id, id: id, age: ageMap.indexOf(age), reason, details, firstaid, future, destination, medicine, form, notes, usage, user, time}))
    if (id) {
      setId(undefined)
    } else {
      setConfirmOpen(true)
    }
    setAge(strings.adult)
    setFirstaid("")
    setMedicine(false)
    setForm(false)
  }

  return (
    <>
      <Dialog open={formOpen} onOpenChange={(event, data) => { setFormOpen(data.open) }}>
        <DialogTrigger><Button appearance="secondary" className={classes.root} icon={<GuestAddRegular/>}>{short ? "" : (event.name.length > 10 ? (event.name.substring(0,10) + '...') : event.name)}</Button></DialogTrigger>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{strings.add_log_entry}
              <DialogTrigger disableButtonEnhancement>
                <Button className={classes.headerButtons} appearance="secondary" icon={<DismissFilled/>}/>
              </DialogTrigger>
              <DialogTrigger>
                <Button className={classes.headerButtons} appearance="primary" onClick={doSave} disabled={reason === ""} icon={<CheckmarkFilled />}/>
              </DialogTrigger>
            </DialogTitle>
            <DialogContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>{strings.age}</TableCell>
                    <TableCell>
                      <Dropdown value={age} onOptionSelect={(e, data) => { setAge(data.optionValue || strings.adult) }} className={classes.dropdown}>
                        <Option key="adult">{strings.adult}</Option>
                        <Option key="youth">{strings.youth}</Option>
                        <Option key="child">{strings.child}</Option>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{strings.reason}</TableCell>
                    <TableCell>
                      <Dropdown onOptionSelect={reasonSelect} className={classes.dropdown}>
                        {codes.map(code => (
                          <Option key={code.code}>{code.code}</Option>
                        ))}
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{strings.reason_detail}</TableCell>
                    <TableCell><Input onChange={(e) => { setDetails(e.target.value) }} className={classes.input} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{strings.firstaid}</TableCell>
                    <TableCell><Input value={firstaid} onChange={(e) => { setFirstaid(e.target.value) }} className={classes.input} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{strings.future_steps}</TableCell>
                    <TableCell><Input value={future} onChange={(e) => { setFuture(e.target.value) }} className={classes.input} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{strings.next_step}</TableCell>
                    <TableCell>
		      <Dropdown value={destination} onOptionSelect={(e, data) => { setDestination(data.optionValue || destinations[0]) }} className={classes.dropdown}>
		        { destinations.map(d => (
                          <Option key={d}>{d}</Option>
			))}
                      </Dropdown>
	            </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Checkbox label={strings.medicine_ok} onChange={(e, data) => { setMedicine(data.checked === true) }} /></TableCell>
                    <TableCell><Checkbox label={strings.form_written} onChange={(e, data) => { setForm(data.checked === true) }} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{strings.other_notes}</TableCell>
                    <TableCell><Input value={notes} onChange={(e) => { setNotes(e.target.value) }} className={classes.input} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{strings.usage}</TableCell>
                    <TableCell><Input value={usage} onChange={(e) => { setUsage(e.target.value) }} className={classes.input} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{strings.log_user}</TableCell>
                    <TableCell><Input value={user} onChange={(e) => { setUser(e.target.value) }} className={classes.input} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{strings.log_time}</TableCell>
                    <TableCell><Input value={time} onChange={(e) => { setTime(e.target.value) }} className={classes.input} /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </DialogContent>
            <DialogActions fluid>
              <DialogTrigger>
                <Button appearance="primary" onClick={doSave} disabled={reason === ""} icon={<CheckmarkFilled />}/>
              </DialogTrigger>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary" icon={<DismissFilled />}/>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <Dialog open={confirmOpen} onOpenChange={(event, data) => { setConfirmOpen(data.open)}}>
        <DialogSurface className={classes.saveDialog}>
          <DialogBody>
            <DialogTitle>{strings.entry_number}: {currentLogId}
            <DialogTrigger disableButtonEnhancement>
              <Button className={classes.headerButtons} appearance="secondary" icon={<DismissFilled/>}/>
            </DialogTrigger>
            </DialogTitle>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
