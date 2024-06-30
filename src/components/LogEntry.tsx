import React, { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "./../hooks"
import { Button, Dialog, DialogTrigger, DialogTitle, DialogContent, DialogSurface, DialogBody, DialogActions, Checkbox, Dropdown, Input, Option, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, makeStyles, tokens } from "@fluentui/react-components"
import { CheckmarkFilled, DismissFilled } from "@fluentui/react-icons"
import { EventData, LogEntryData } from "../services/models"
import { getEvent, doLog } from "./../services/events"
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
  idCell: {
    width: "50px",
    maxWidth: "50px",
  },
  timeCell: {
    width: "80px",
    maxWidth: "80px",
  }
})

export const LogEntry: React.FC<Props> = ({event}) => {
  const classes = useStyles()
  const appSelector = useAppSelector
  const appDispatch = useAppDispatch()
  const login = appSelector(state => state.login)
  const codes = appSelector(state => state.events.codes)
  const [formOpen, setFormOpen] = useState(false)
  const [listOpen, setListOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [id, setId] = useState()
  const [sex, setSex] = useState(strings.male)
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
  const [logEntries, setLogEntries] = useState([] as LogEntryData[])
  const currentLogId = appSelector((state) => state.events.currentLogId)

  const sexMap = [strings.male, strings.female, strings.sex_other, strings.wont_tell]
  const ageMap = [strings.child, strings.youth, strings.adult]

  const reasonSelect = (e: any, data: any) => {
    setReason(data.optionValue || "")
    codes.forEach(code => {
      if (code.code === data.optionValue) {
        setFirstaid(code.firstaid)
      }
    })
  }
  
  const doSave = () => {
    appDispatch(doLog({event_id: event.id, id: id, sex: sexMap.indexOf(sex), age: ageMap.indexOf(age), reason, details, firstaid, future, destination, medicine, form, notes, usage, user, time}))
    if (id) {
      setId(undefined)
    } else {
      setConfirmOpen(true)
    }
    setSex(strings.male)
    setAge(strings.adult)
    setFirstaid("")
    setMedicine(false)
    setForm(false)
  }

  const editLogEntry = (id: any) => {
    const entry = logEntries[id-1]
    setId(id)
    setSex(sexMap[entry.sex])
    setAge(ageMap[entry.age])
    setReason(entry.reason)
    setDetails(entry.details || "")
    setFirstaid(entry.firstaid)
    setFuture(entry.future || "")
    setDestination(entry.destination || "")
    setMedicine(entry.medicine)
    setForm(entry.form)
    setNotes(entry.notes || "")
    setUsage(entry.usage || "")
    setUser(entry.user)
    setTime(entry.time)
    setListOpen(false)
    setFormOpen(true)
  }

  useEffect(() => {
    getEvent(event.id).then(data => {
      setLogEntries(data.data.log_entries)
    })
  }, [])
  
  return (
    <>
      <Dialog open={formOpen} onOpenChange={(event, data) => { setFormOpen(data.open) }}>
        <DialogTrigger><Button appearance="secondary" className={classes.root}>{strings.log_entry} / {event.name}</Button></DialogTrigger>
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
                    <TableCell>{strings.sex}</TableCell>
                    <TableCell>
                      <Dropdown value={sex} onOptionSelect={(e, data) => { setSex(data.optionValue || strings.male) }} className={classes.dropdown}>
                        <Option>{strings.male}</Option>
                        <Option>{strings.female}</Option>
                        <Option>{strings.sex_other}</Option>
                        <Option>{strings.wont_tell}</Option>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
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
                    <TableCell><Input value={destination} onChange={(e) => { setDestination(e.target.value) }} className={classes.input} /></TableCell>
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
            <DialogActions>
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
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{strings.entry_number}: {currentLogId}
            <DialogTrigger disableButtonEnhancement>
              <Button className={classes.headerButtons} appearance="secondary" icon={<DismissFilled/>}/>
            </DialogTrigger>
            </DialogTitle>
          </DialogBody>
        </DialogSurface>
      </Dialog>
     <Dialog open={listOpen} onOpenChange={(event, data) => { setListOpen(data.open) }}>
        <DialogTrigger><Button appearance="secondary" className={classes.root}>{strings.log_entries}</Button></DialogTrigger>
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
    </>
  )
}
