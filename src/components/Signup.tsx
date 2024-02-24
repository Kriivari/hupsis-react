import React, { useState } from "react"
import { Button, Dialog, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Input, ToggleButton, Textarea, makeStyles, tokens } from "@fluentui/react-components"
import { CommentRegular, DismissFilled, DismissCircle48Regular, DismissCircle48Filled, CheckmarkFilled, CheckmarkCircle48Regular, CheckmarkCircle48Filled, PersonWalkingRegular } from "@fluentui/react-icons"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { DatePicker } from "@fluentui/react-datepicker-compat"
import { AddToCalendarButton } from 'add-to-calendar-button-react'
import { EventData, EventShiftData, EventUserData } from "../services/models"
import { getDate, parseHupsisTime, formatISO, formatCalendarDay, formatCalendarTime, formatHupsisTime, formatHupsisTimePart, formatShortTimeSpan } from "./../util"
import { useAppSelector, useAppDispatch } from "./../hooks"
import { doSignup, changeSignup, deleteSignup } from "./../services/events"
import { strings } from "./../localization"

interface Props {
  event: EventData
  shift: EventShiftData
  signup?: EventUserData
  multishift: boolean
  isOpen: boolean
  mobile: boolean
  popup: boolean
  editable: boolean
}

const useStyles = makeStyles({
  root: {
    width: "140px",
  },
  signup: {
    marginRight: tokens.spacingHorizontalMNudge,
    marginBottom: tokens.spacingVerticalXS,
  },
  signupGreen: {
    marginRight: tokens.spacingHorizontalMNudge,
    marginBottom: tokens.spacingVerticalXS,
    backgroundColor: tokens.colorPaletteGreenBackground2,
  },
  signupRed: {
    marginRight: tokens.spacingHorizontalMNudge,
    marginBottom: tokens.spacingVerticalXS,
    backgroundColor: tokens.colorPaletteRedBackground3,
  },
  dialog: {
    width: "250px",
    height: "250px",
  },
  mileage: {
    width: "140px",
    marginRight: tokens.spacingHorizontalL,
  },
  textArea: {
    width: "200px",
    height: "150px",
  },
  dialogTitle: {
    textAlign: "right",
  },
  alignLeft: {
    textAlign: "left",
  },
  green: {
    marginRight: tokens.spacingHorizontalXS,
    backgroundColor: tokens.colorPaletteGreenBackground2,
  },
  red: {
    backgroundColor: tokens.colorPaletteRedBackground3,
  },
})

export const Signup: React.FC<Props> = ({ event, shift, signup, multishift, isOpen, mobile, popup, editable }) => {
  const classes = useStyles()
  const appSelector = useAppSelector
  const login = appSelector(state => state.login)
  let realSignup = signup
  const userSignups = shift.event_users ? shift.event_users.filter((e: EventUserData) => e.user && e.user.id === login.id && e.role_id !== 14) : []
  if (!realSignup) {
    realSignup = userSignups.length > 0 ? userSignups[0] : undefined
  }
  const signupId = realSignup ? realSignup.id : -1
  if (realSignup) {
    const fullSignup = event.full_signups.filter(s => realSignup && s.id === realSignup.id)[0]
    realSignup = fullSignup || realSignup
  }
  const [hideSave, setHideSave] = useState(true)
  const coming = realSignup && realSignup.role_id < 10
  const notComing = realSignup && realSignup.role_id === 16
  const [startDate, setStartDate] = useState<Date | null | undefined>(getDate(realSignup ? realSignup.start_time : shift.start_time))
  const [endDate, setEndDate] = useState<Date | null | undefined>(getDate(realSignup ? realSignup.end_time : shift.end_time))
  const [comments, setComments] = useState(realSignup ? realSignup.comments : "")
  let leader = realSignup && realSignup.role_id === 5
  let confirmed = realSignup && realSignup.confirmed
  const [mileage, setMileage] = useState(realSignup ? realSignup.mileage : signup ? "" : login.default_mileage)
  const [costExplanation, setCostExplanation] = useState(realSignup ? realSignup.cost_explanation : "")
  const hidden = !isOpen && userSignups.length === 0
  const multiDay = getDate(shift.start_time).getDay() - getDate(shift.end_time).getDay() !== 0
  let disabled = false;

  const appDispatch = useAppDispatch()

  const setStart = (d: Date | null | undefined) => {
    console.log("Setting start to " + d)
    setStartDate(d)
    showSave()
  }

  const setEnd = (d: Date | null | undefined) => {
    setEndDate(d)
    showSave()
  }

  const parseStartTime = (s: string): Date | null => {
    return parseHupsisTime(startDate, s)
  }
  
  const parseEndTime = (s: string): Date | null => {
    return parseHupsisTime(endDate, s)
  }
  
  const showSave = () => {
    if (realSignup) {
      setHideSave(false)
    }
  }

  const changeComments = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value)
    showSave()
  }
  
  const changeMileage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMileage(parseInt(e.target.value))
    showSave()
  }
  
  const changeCostExplanation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCostExplanation(e.target.value)
    showSave()
  }
  
  const cancelChanges = (e: React.FormEvent<HTMLButtonElement>) => {
    setHideSave(true)
  }

  const doConfirmed = (e: React.FormEvent<HTMLButtonElement>) => {
    if (realSignup && realSignup.trainee) {
      confirmed = !confirmed
    } else {
      if (confirmed && leader) {
        confirmed = false
	leader = false
      } else {
        if (confirmed) {
	  leader = true
	} else {
	  confirmed = true
	}
      }
    }
    appDispatch(changeSignup({eventId: shift.event_id, shiftId: shift.id, signupId: signupId, startTime: formatHupsisTime(startDate), endTime: formatHupsisTime(endDate), roleId: ((confirmed && leader) ? 5 : 6), comments, confirmed, type: (coming ? "coming" : "notcoming")}))
  }
  
  const saveChanges = (e: React.FormEvent<HTMLButtonElement>) => {
    if (realSignup && e.currentTarget.parentElement && e.currentTarget.parentElement.parentElement) {
      setHideSave(true)
      disabled = true
      const m = parseInt(mileage ? (mileage + "") : "")
      appDispatch(changeSignup({eventId: shift.event_id, shiftId: shift.id, signupId: signupId, roleId: (leader ? 5 : 6), startTime: formatHupsisTime(startDate), endTime: formatHupsisTime(endDate), comments, confirmed, mileage: m, cost_explanation: costExplanation, type: coming ? "coming" : "notcoming"}))
    }
  }

  const doComing = (e: React.FormEvent<HTMLButtonElement>) => {
    disabled = true
    if (e.currentTarget.value && e.currentTarget.parentElement && e.currentTarget.parentElement.parentElement && e.currentTarget.parentElement.parentElement.parentElement && e.currentTarget.parentElement.parentElement.parentElement.parentElement) {
      if ((e.currentTarget.value === "coming" && notComing) || (e.currentTarget.value === "notcoming" && coming)) {
        const m = parseInt(mileage ? (mileage + "") : "")
        appDispatch(changeSignup({eventId: shift.event_id, shiftId: shift.id, signupId: signupId, roleId: (leader ? 5 : 6), startTime: formatHupsisTime(startDate), endTime: formatHupsisTime(endDate), comments, confirmed, mileage: m, cost_explanation: costExplanation, type: e.currentTarget.value}))
      } else {
        appDispatch(doSignup({eventId: shift.event_id, shiftId: shift.id, signupId: signupId, roleId: (leader ? 5 : 6), startTime: formatHupsisTime(startDate), endTime: formatHupsisTime(endDate), comments, confirmed, type: e.currentTarget.value}))
      }
    } else {
      appDispatch(deleteSignup({eventId: shift.event_id, shiftId: shift.id, signupId: signupId, roleId: 0, startTime: '', endTime: '', comments: '', confirmed, type: ''}))
    }
  }
  
  return (
      <Row>
        { (multishift || (signup && signup.user)) && (
          <Col xs={7} sm={2}>
            {multishift && (shift.name || formatShortTimeSpan(shift.start_time, shift.end_time))}
	          {signup && (!signup.user || signup.user.id !== login.id) && (
	            <div>{signup.user ? signup.user.last_name + " " + signup.user.first_name : signup.comments}</div>
	          )}
	        </Col>
	      )}
        <Col xs={multishift ? 3 : 2} sm="auto">
          <ToggleButton key="coming_{realSignup ? realSignup.id : shift.id}" id={"coming_" + (realSignup ? realSignup.id : shift.id)} name="coming" value="coming" checked={coming} onClick={doComing} disabled={disabled || !isOpen} icon={coming ? <CheckmarkCircle48Filled  /> : <CheckmarkCircle48Regular />} size="large" className={coming ? classes.signupGreen : classes.signup} title="Tulen"/>
	      </Col>
        <Col xs={multishift ? 3 : 2} sm={multishift ? 2 : "auto"} md="auto">
	        <ToggleButton key="notcoming_{realSignup ? realSignup.id : shift.id}" id={"notcoming_" + (realSignup ? realSignup.id : shift.id)} name="notcoming" value="notcoming" checked={notComing} onClick={doComing} disabled={disabled || !isOpen} icon={notComing ? <DismissCircle48Filled /> : <DismissCircle48Regular /> } size="large" className={notComing ? classes.signupRed : classes.signup} />
	      </Col>
	      <Col xs={multishift ? 6 : 7} sm="auto" className={mobile ? 'd-xs-block pt-1' : 'd-xs-block d-lg-none pt-1'}>
	        <Dialog>
	          <DialogTrigger><Button>{formatShortTimeSpan(realSignup ? realSignup.start_time : shift.start_time, realSignup ? realSignup.end_time : shift.end_time)}</Button></DialogTrigger>
	          <DialogSurface className={classes.dialog}>
	            <DialogBody>
	              <DialogTitle className={classes.dialogTitle}><DialogTrigger><Button icon={(<DismissFilled />)} /></DialogTrigger></DialogTitle>
		            <DialogContent>
		              <Row>
		                <Col>
		                  <Field label={strings.start_time}>
   	                    <DatePicker minDate={getDate(shift.start_time)} maxDate={getDate(shift.end_time)} value={startDate} onSelectDate={setStart} formatDate={multiDay ? formatISO : formatHupsisTimePart} disabled={!isOpen} isMonthPickerVisible={false} type={multiDay ? "datetime-local" : "time"} parseDateFromString={parseStartTime} allowTextInput={true} showGoToToday={false} showCloseButton={true} />
		                  </Field>
		                </Col>
		              </Row>
		              <Row className="pt-1">
		                <Col>
		                  <Field label={strings.end_time}>
   	                    <DatePicker minDate={getDate(shift.start_time)} maxDate={getDate(shift.end_time)} value={endDate} onSelectDate={setEnd} formatDate={multiDay ? formatISO : formatHupsisTimePart} disabled={!isOpen} isMonthPickerVisible={false} type={multiDay ? "datetime-local" : "time"} parseDateFromString={parseEndTime} allowTextInput={true} showGoToToday={false} showCloseButton={true}/>
		                  </Field>
		                </Col>
		              </Row>
                  { !signup && realSignup && coming && (
		                <Row className="pt-1">
		                  <Col>
	                      <AddToCalendarButton
                          name={event.name}
                          startDate={formatCalendarDay(realSignup.start_time)}
                          startTime={formatCalendarTime(realSignup.start_time)}
                          endDate={formatCalendarDay(realSignup.end_time)}
                          endTime={formatCalendarTime(realSignup.end_time)}
	                        timeZone="Europe/Helsinki"
	                        location={event.location}
                          options={['Apple','Google','Microsoft365','iCal']}
	                        hideTextLabelButton
	                        forceOverlay
	                        listStyle="modal"
	                        buttonStyle="3d"
	                        size="1"
                        />
	                    </Col>
		                </Row>
	                ) }
		            </DialogContent>
	            </DialogBody>
	          </DialogSurface>
	        </Dialog>
	      </Col>
        <Col xs={1} lg="auto" className={mobile ? 'd-none' : 'd-none d-lg-block pt-1'}>
	        <DatePicker minDate={getDate(shift.start_time)} maxDate={getDate(shift.end_time)} value={startDate} onSelectDate={setStart} formatDate={multiDay ? formatISO : formatHupsisTimePart} disabled={!isOpen} isMonthPickerVisible={false} type={multiDay ? "datetime-local" : "time"} parseDateFromString={parseStartTime} allowTextInput={true} showGoToToday={false} showCloseButton={true} className={multishift ? "me-2" : "mb-2 mb-sm-0 me-sm-2"} />
	      </Col>
        <Col xs={1} lg="auto" className={mobile ? 'd-none' : 'd-none d-lg-block pt-1'}>
	        <DatePicker minDate={getDate(shift.start_time)} maxDate={getDate(shift.end_time)} value={endDate} onSelectDate={setEnd} formatDate={multiDay ? formatISO : formatHupsisTimePart} disabled={!isOpen} isMonthPickerVisible={false} type={multiDay ? "datetime-local" : "time"} parseDateFromString={parseEndTime} allowTextInput={true} showGoToToday={false} showCloseButton={true}/>
        </Col>
        { !signup && realSignup && coming && (
          <Col xs={1} lg="auto" className={mobile ? 'd-none' : 'd-none d-lg-block'}>
	          <AddToCalendarButton
              name={event.name}
              startDate={formatCalendarDay(realSignup.start_time)}
              startTime={formatCalendarTime(realSignup.start_time)}
              endDate={formatCalendarDay(realSignup.end_time)}
              endTime={formatCalendarTime(realSignup.end_time)}
              timeZone="Europe/Helsinki"
	            location={event.location}
              options={['Apple','Google','Microsoft365','iCal']}
	            label="Lisää kalenteriin"
	            hideTextLabelButton
	            forceOverlay
	            listStyle="modal"
	            buttonStyle="3d"
	            size="1"
            />
	        </Col>
	      ) }
        { event.type_id === 1 && event.owner_group.firstaid && !event.hide_travel_costs && (
	        <Col xs={multishift ? 3 : 2} sm="auto" className="pt-1 pb-2 pb-sm-0">
	          <Dialog>
	            <DialogTrigger>
		            <Button icon={<PersonWalkingRegular />} className="me-2 mb-md-0" />
		          </DialogTrigger>
		          <DialogSurface className={classes.dialog}>
		            <DialogBody>
  	              <DialogTitle className={classes.dialogTitle}><DialogTrigger><Button icon={(<DismissFilled />)} /></DialogTrigger></DialogTitle>
		              <DialogContent>
		                <Field label={strings.mileage}>
  	                  <Input id="mileage" name="mileage" type="text" value={mileage ? "" + mileage : ""} onChange={changeMileage} className={classes.mileage}/>
		                </Field>
		                <Field label={strings.explanation}>
 	                    <Input id="costExplanation" name="costExplanation" type="text" value={costExplanation} onChange={changeCostExplanation} className={classes.root}/>
		                </Field>
		              </DialogContent>
		            </DialogBody>
		          </DialogSurface>
	          </Dialog>
	        </Col>
	      ) }
	      <Col xs={multishift ? 3 : 2} sm="auto" className="pt-1 pb-2 pb-sm-0">
	        <Dialog>
	          <DialogTrigger>
		          <Button icon={<CommentRegular />} />
		        </DialogTrigger>
		        <DialogSurface className={classes.dialog}>
		          <DialogBody>
  	            <DialogTitle><Row><Col xs={9}>{strings.comments}</Col><Col><DialogTrigger><Button icon={(<DismissFilled />)} /></DialogTrigger></Col></Row></DialogTitle>
		            <DialogContent>
                  <Textarea id="comments" name="comments" value={comments} onChange={changeComments} disabled={hidden} className={classes.textArea}/>
		            </DialogContent>
		          </DialogBody>
		        </DialogSurface>
	        </Dialog>
        </Col>
	      { realSignup && coming && (
	        <Col xs="auto" className="pt-1 pb-sm-2 pb-lg-0 float-end">
	          <>
	            { editable ? (
	              <ToggleButton key="confirmed" checked={confirmed || leader} onClick={doConfirmed}>{ leader ? strings.leader : (confirmed ? strings.confirmed : strings.confirm) }</ToggleButton>
	            ) : (
	              <span>{leader ? strings.leader : (confirmed && strings.confirmed)}</span>
	            )}
	            { realSignup.trainee && (<span> {strings.trainee} </span>) }
	          </>
          </Col>
	      ) }
	    <Col xs={3} sm="1" className="pt-1 d-sm-none">
	      <Button key="save" icon={<CheckmarkFilled />} className={classes.green} hidden={hideSave} onClick={saveChanges} />
	    </Col>
	    <Col xs={3} sm="1" className="pt-1 d-sm-none">
	      <Button key="cancel" icon={<DismissFilled />} className={classes.red} hidden={hideSave} onClick={cancelChanges} />
	    </Col>
	    <Col xs={1} sm="auto" className="d-none d-sm-block pt-1 pull-right">
	      <Button key="save" icon={<CheckmarkFilled />} className={classes.green} hidden={hideSave} onClick={saveChanges} />
	      <Button key="cancel" icon={<DismissFilled />} className={classes.red} hidden={hideSave} onClick={cancelChanges} />
	    </Col>
    </Row>
  )

}
