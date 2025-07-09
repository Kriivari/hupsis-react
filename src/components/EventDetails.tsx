import React, { useState } from "react"
import ReactHtmlParser from "html-react-parser"
import ReactQuill from "react-quill"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Collapse from "react-bootstrap/Collapse"
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionToggleEventHandler, Button, Card, Divider, Dropdown, Input, Link, Option, Radio, RadioGroup, TableRow, TableCell, makeStyles, tokens } from "@fluentui/react-components"
import type { DropdownProps, InputProps } from "@fluentui/react-components"
import { ParticipantTable } from "./ParticipantTable"
import { LogEntry } from "./LogEntry"
import { LogList } from "./LogList"
import { EventLogEntry } from "./EventLogEntry"
import { EventLogList } from "./EventLogList"
import { Signup } from "./Signup"
import { Avatars } from "./Avatars"
import { EventData, EventShiftData } from "../services/models"
import { strings } from "../localization"
import { formatDateSpan, formatShortTimeSpan } from "../util"
import { useAppSelector, useAppDispatch } from "../hooks"
import "react-quill/dist/quill.snow.css"
import { doNotifyParticipants } from "../services/events"

interface Props {
  id: number
  mobile: boolean
  popup: boolean
}

const useStyles = makeStyles({
  coming: {
    backgroundColor: tokens.colorBrandBackground2Hover,
    borderBottomStyle: "solid",
  },
  notcoming: {
    backgroundColor: tokens.colorPaletteYellowBorder1,
    borderBottomStyle: "solid",
  },
  free: {
    backgroundColor: tokens.colorPaletteLightGreenBackground2,
    borderBottomStyle: "solid",
  },
  full: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottomStyle: "solid",
  },
  closed: {
    backgroundColor: tokens.colorNeutralForegroundDisabled,
    borderBottomStyle: "solid",
  },
  participants: {
    marginRight: tokens.spacingHorizontalXS,
    width: "250px",
  },
  floatLeft: {
    float: "left",
  },
  floatRight: {
    float: "right",
  },
  messageTitle: {
    width: "700px",
  },
})

const EventDetails: React.FC<Props> = ({ id, mobile, popup }) => {
  const dayjs = require("dayjs-with-plugins")
  const classes = useStyles()
  const appDispatch = useAppDispatch()
  const appSelector = useAppSelector
  const event = appSelector(state => state.events.events.find(ev => ev.id === id)) || {} as EventData
  const login = appSelector(state => state.login)
  const [open, setOpen] = useState(popup)
  const [openItems, setOpenItems] = useState(["signup"])
  const [eventMessageSubject, setEventMessageSubject] = useState(strings.default_message_subject + " '" + event.name + "' " + formatShortTimeSpan(event.start_time, event.end_time))
  const [eventMessage, setEventMessage] = useState("")
  const [eventMessageDistribution, setEventMessageDistribution] = useState(0)
  const [eventMessageDisabled, setEventMessageDisabled] = useState(true)
  const [eventMessageSelectedOptions, setEventMessageSelectedOptions] = React.useState<string[]>()
  const [eventMessageSelectedValue, setEventMessageSelectedValue] = React.useState("")
  const contacts = event ? event.event_users.filter(u => u.role_id === 14) : null
  const contact = contacts && contacts.length > 0 ? contacts[0].user : null
  const users = event ? event.event_users.filter(u => u.role_id < 10) : []
  const notcomingUsers = event ? event.event_users.filter(u => u.role_id === 16) : []
  const mySignupDatas = event.event_users.filter(u => u.user && u.user.id === login.id && u.role_id !== 14)
  const mySignups: number[] = mySignupDatas.map(u => u.event_shift_id)
  const admin = (login.eagroups && login.eagroups.filter(eg => eg.name === event.owner_group.name && eg.role < 6).length > 0) || false
  const editable = (event.event_users.filter(u => u.user && u.user.id === login.id && (u.role_id === 14 || u.role_id === 5)).length > 0)
  const currentEvent = mySignups.length > 0 && dayjs(event.start_time).toDate().getTime() < ((new Date()).getTime() + 7200000) && dayjs(event.end_time).toDate().getTime() > ((new Date()).getTime() - 7200000)

  const rowStyle = mySignupDatas.filter(u => u.role_id < 10).length > 0 ? "coming" : (mySignupDatas.filter(u => u.role_id === 16).length > 0 ? "notcoming" : (!event.is_open ? "closed" : (event.missing ? "free" : "full")))

  const uniqueNames = () => {
    const unique: string[] = []
    users.forEach(u => {
      if (u.user) {
        const key = u.user.first_name + " " + u.user.last_name
	if (!unique.includes(key)) {
	  unique.push(key)
	}
      }
    })
    return unique
  }

  const handleToggle: AccordionToggleEventHandler<string> = (event, data) => { setOpenItems(data.openItems) }

  const handleProcedureContentChange = (content: any) => {
    setEventMessage(content);
    setEventMessageDisabled(content.length < 10)
  }

  const handleSubjectChange: InputProps["onChange"] = (ev, data) => {
    setEventMessageSubject(data.value);
  }

  const sendParticipantMessage = () => {
    appDispatch(doNotifyParticipants({eventId: event.id, shifts: eventMessageSelectedOptions, content: eventMessage, title: eventMessageSubject, distribution: eventMessageDistribution}))
    setEventMessage("")
    setEventMessageSubject("")
    setEventMessageDistribution(0)
  }

  const onOptionSelect: DropdownProps["onOptionSelect"] = (ev, data) => {
    setEventMessageSelectedOptions(data.selectedOptions);
    setEventMessageSelectedValue(data.optionText ?? "");
  }

  return (
      <>
        {popup ? (
        <TableRow key={event.id}>
          <TableCell>{event.owner_group.name}</TableCell>
	        <TableCell><Avatars names={uniqueNames()} /></TableCell>
        </TableRow>
        ) : (
        <TableRow key={event.id} onClick={() => setOpen(!open)} className={classes[rowStyle]}>
          <TableCell>
            {event.name}
          </TableCell>
          <TableCell>
            {formatDateSpan(event.start_time, event.end_time)}
          </TableCell>
	        { !mobile &&
	        (
	          <>
              <TableCell>
                {event.location}
              </TableCell>
              <TableCell>
                {event.owner_group.name}
              </TableCell>
              <TableCell>
                {(event.required && event.required > 0) ? ((event.required-event.missing) + "/" + event.required) : (users.length)}
	            </TableCell>
	            <TableCell>
	              <Avatars names={uniqueNames()} />
              </TableCell>
  	        </>
	        ) }
        </TableRow>
        ) }
        <Collapse key={event.id + "-collapse"} in={open}>
          <TableRow key={event.id + '-details'}>
            <TableCell colSpan={mobile ? 2 : 6}>
            { currentEvent && (
              <>
                <div className="mb-2">
                  <span><LogEntry event={event} short={true}/></span>
                  <span><LogList event={event} /></span>
                  <span><EventLogEntry event={event} short={true}/></span>
                  <span><EventLogList event={event} /></span>
                </div>
              </>
            ) }
            { (event.is_open || mySignups.length > 0) && (
              <Card key={event.id + "-card"}>
              { event.event_shifts.filter((shift: EventShiftData) => mySignups.includes(shift.id) || ((event.is_open || admin) && (event.type_id > 1 || ((login.trainee && event.trainee) || login.volunteer)) && (!shift.qualification_id || (login.qualifications && login.qualifications.map(q => q.id).includes(shift.qualification_id))))).sort((a,b):number => {return a.start_time < b.start_time ? -1 : 1}).map((shift: EventShiftData) => (
                <div key={shift.id + "-top"}>
                  <Signup key={shift.id} event={event} shift={shift} multishift={(event.event_shifts.length > 1)} isOpen={editable || admin || shift.is_open} mobile={mobile} popup={popup} editable={editable}/>
  	              <Divider key={shift.id + "-div"} />
	              </div>
	            )
              )}
              </Card>
            ) }
            <Accordion key={event.id + "-accordion"} openItems={openItems} onToggle={handleToggle} multiple collapsible>
              <AccordionItem key={event.id + "-accordion-details"} value="details">
                <AccordionHeader>{strings.event_details}</AccordionHeader>
                <AccordionPanel>
                  <div> {event.details_markdown && ReactHtmlParser(event.details_markdown)} </div>
                  <div> {event.confirmed_notes_markdown && ReactHtmlParser(event.confirmed_notes_markdown)} </div>
                  <div>{event.food ? strings.food_available : strings.food_notavailable}</div>
                  {contact && (
                    <div>{strings.contact}:
                      {contact.email ? (
                        <a href={"mailto:" + contact.email}>{contact.last_name + " " + contact.first_name}</a>
                      ) : (
                        <span> {contact.last_name + " " + contact.first_name}</span>
                      )}
                      {contact.phone ? " " + contact.phone : ""}
                    </div>
                  )}
                  <div className="mt-1"><Link href={strings.old_link + "events/" + event.id} target="_blank">{strings.to_old_hupsis}</Link></div>
                </AccordionPanel>
              </AccordionItem>
              {admin && users.length > 0 &&
                <AccordionItem key={event.id + "-accordion-admin"} value="admin">
                  <AccordionHeader>{strings.event_admin}</AccordionHeader>
                  <AccordionPanel>
                    <Row><Col xs={8}><Input className={classes.messageTitle} onChange={handleSubjectChange} value={eventMessageSubject} placeholder={strings.message_subject} /></Col></Row>
                    <Row><Col xs={8}><ReactQuill
                      theme="snow"
                      value={eventMessage}
                      onChange={handleProcedureContentChange}
                    /></Col></Row>
                    <Row className="mt-1">
                      <Col><Button appearance="primary" disabled={eventMessageDisabled} onClick={sendParticipantMessage}>{strings.send_message}</Button></Col>
                      { event.event_shifts.length > 1 && (
                        <Col>
                          <Dropdown multiselect={true} onOptionSelect={onOptionSelect}>
                          {event.event_shifts.map((shift) => (
                            <Option key={shift.id} value={"" + shift.id}>{shift.name || formatShortTimeSpan(shift.start_time, shift.end_time)}</Option>
                          ))}
                          </Dropdown>
                        </Col>
                      ) }
                      <Col xs={event.event_shifts.length > 1 ? 6 : 8}>
                        <RadioGroup value="0" layout="horizontal">
                          <Radio value="0" label={strings.all_signedup} />
                          <Radio value="1" label={strings.all_confirmed} />
                          <Radio value="2" label={strings.all_nonconfirmed} />
                        </RadioGroup>
                      </Col>
                    </Row>
                  </AccordionPanel>
                </AccordionItem>
              }
              {(users.length + notcomingUsers.length) > 0 ? (
                <AccordionItem key={event.id + "-accordion-users"} value="users">
                  <AccordionHeader>{strings.signed_up}  {event.required && event.required > 0 ? (event.required - event.missing) + "/" + event.required : ""}</AccordionHeader>
                  <AccordionPanel>
                    <div key={event.id + "-participants"}><ParticipantTable mobile={mobile} popup={popup} editable={editable || admin} userId={login.id} event={event} participants={users} notcoming={notcomingUsers} /></div>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                <div />
              )}
            </Accordion>
          </TableCell>
        </TableRow>
      </Collapse>
    </>
  )
  
}

export default EventDetails
