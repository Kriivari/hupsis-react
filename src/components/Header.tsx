import React from "react"
import { useNavigate } from "react-router-dom"
import { createHash } from 'crypto'
import { useAppDispatch, useAppSelector } from "./../hooks"
import { logout } from "../services/users"
import { setCalendar } from "../redux/slices/loginSlice"
import { clearEvents, doSearch } from "../redux/slices/eventSlice"
import { getDate } from "./../util"
import { strings } from "./../localization"
import { Avatar, Button, Link, Menu, MenuItem, MenuItemLink, MenuList, MenuPopover, MenuTrigger, Table, TableBody, TableCell, TableRow, Toolbar, ToolbarButton, makeStyles, shorthands, tokens } from '@fluentui/react-components'
import { Calendar24Regular, MoreHorizontal24Filled, TextBulletListLtr24Filled } from "@fluentui/react-icons"
import { SearchBox } from '@fluentui/react-search-preview'
import { getAll } from "./../services/events"
import { NextEvent } from "./NextEvent"
import { LogEntry } from "./LogEntry"
import { EventLogEntry } from "./EventLogEntry"

interface Props {
  mobile: boolean
  width: number
}

const useStyles = makeStyles({
  root: { display: 'flex',
    backgroundColor: tokens.colorPaletteRedForeground1,
    color: tokens.colorNeutralBackground1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topMargin: {
    height: "40px",
  },
  logo : {
    backgroundColor: tokens.colorPaletteRedForeground1,
    color: tokens.colorNeutralBackground1,
    fontWeight: 'bold',
    fontSize: '24px',
    ...shorthands.textDecoration('none'),
  },
  persona: {
    display: 'flex',
    backgroundColor: tokens.colorPaletteRedForeground1,
    color: tokens.colorNeutralBackground1,
    justifyContent: 'space-between',
    alignItems: 'center',
    textColor: tokens.colorNeutralBackground1,
  },
  next: {
    height: "160px",
    boxShadow: "0px 19px 38px 0px rgba(0,0,0,0.3)",
    marginLeft: tokens.spacingHorizontalMNudge,
    borderBottomStyle: "none",
  },
  fullWidth: {
    height: "100px",
    width: "100%",
    boxShadow: "0px 19px 38px 0px rgba(0,0,0,0.3)",
    marginLeft: tokens.spacingHorizontalMNudge,
    marginTop: tokens.spacingVerticalXS,
    borderBottomStyle: "none",
  },
  table: {
    borderBottomStyle: "none",
    marginRight: tokens.spacingHorizontalMNudge,
    marginBottom: tokens.spacingVerticalS,
  },
  logentry: {
    marginLeft: tokens.spacingHorizontalS,
  },
  search: {
    color: tokens.colorNeutralBackground1,
  },
  hide: {
    display: "none",
  },
})

export const Header: React.FC<Props> = ({ mobile, width }) => {
  const dayjs = require("dayjs-with-plugins")
  const appDispatch = useAppDispatch()
  const appSelector = useAppSelector
  const navigate = useNavigate();
  const user = appSelector(state => state.login)
  const events = appSelector(state => state.events.events)
  const currentEvents = events.filter(ev => ev.type_id === 1 && ev.event_users.filter(eu => eu.user && eu.user.id === user.id && eu.role_id < 10 && getDate(eu.start_time).getTime() < ((new Date()).getTime() + 7200000) && getDate(eu.end_time).getTime() > ((new Date()).getTime() - 7200000)).length > 0)
  const currentEvent = currentEvents && currentEvents.length > 0 ? currentEvents[0] : null
  const avatar = user.email ? {src: "https://gravatar.com/avatar/" + createHash('sha256').update(user.email.toLowerCase().trim()).digest('hex')} : {}
  const classes = useStyles()

  const doLogout = async () => {
    await appDispatch(logout())
    await appDispatch(clearEvents())
    navigate("/", { replace: true })
  }

  const handleRefresh = async ():Promise<void> => {
    appDispatch(getAll({start: dayjs().startOf("month").toDate(), end: dayjs().add(10, "year").startOf("month").toDate()}))
  }

  return (
  <>
    { (width < 500) && (
      <Toolbar className={classes.topMargin}/>
    ) }
    <Toolbar className={classes.root}>
      <Link onClick={handleRefresh} className={classes.logo}>Hupsis</Link>
      <SearchBox className={mobile ? classes.hide : classes.search} onChange={(e:any, d:any) => appDispatch(doSearch(d.value))} />
      <div className={classes.root}>
      { user.usecalendar ? (
        <Button icon={<TextBulletListLtr24Filled />} className={classes.root} onClick={() => appDispatch(setCalendar(false))}/>
        ) : (
        <Button icon={<Calendar24Regular />} className={classes.root} onClick={() => appDispatch(setCalendar(true))}/>
	) }
      <Menu>
	<MenuTrigger>
	  <ToolbarButton icon={<MoreHorizontal24Filled />} className={classes.root}/>
	</MenuTrigger>
	<MenuPopover>
	  <MenuList>
	    <MenuItem onClick={() => doLogout()}>{ strings.logout }</MenuItem>
	    <MenuItemLink href={strings.old_link}>Hupsis v1</MenuItemLink>
	  </MenuList>
	</MenuPopover>
      </Menu>
      <Avatar className={classes.persona} name={ user.first_name + " " + user.last_name } image={avatar}/>
      </div>
    </Toolbar>
    { currentEvent && (
      <>
        <div className={classes.logentry}><LogEntry event={currentEvent} /></div>
        <div className={classes.logentry}><EventLogEntry event={currentEvent} /></div>
      </>
    )}
    <Table className={classes.table}>
      <TableBody>
        <TableRow className={classes.table}>
          <TableCell className={mobile ? classes.fullWidth : classes.next}>
            <NextEvent type={1} mobile={mobile}/>
          </TableCell>
	  { mobile ?
	  (
	    <TableCell />
	  ) : (
	    <>
	      <TableCell className={classes.next}>
                <NextEvent type={2} mobile={mobile}/>
	      </TableCell>
	      <TableCell />
	    </>
	  ) }
        </TableRow>
      </TableBody>
    </Table>
  </>
  )
}

export default Header
