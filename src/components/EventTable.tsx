import React, { useState } from "react"
import { Menu, MenuButton, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, Table, TableHeader, TableBody, TableRow, TableHeaderCell, ToggleButton, Toolbar, makeStyles } from "@fluentui/react-components"
import { Calendar24Regular } from "@fluentui/react-icons"
import EventDetails from "./EventDetails"
import { useAppSelector } from "./../hooks"
import { getDate } from "./../util"
import { strings } from "./../localization"

interface Props {
  mobile: boolean
}

const useStyles = makeStyles({
  root: {
    fontWeight: "bold",
  },
  participants: {
    fontWeight: "bold",
    width: "50px",
  },
  menubutton: {
    width: "15%",
  }
})

export const EventTable: React.FC<Props> = ({mobile}) => {
  const classes = useStyles()
  const appSelector = useAppSelector
  const events = appSelector(state => state.events.events)
  const search = appSelector(state => state.events.search)
  const [filter, setFilter] = useState(0)
  const [groupFilter, setGroupFilter] = useState("none")
  const onlyUnique = (value:any, index:number, array:any) => { return array.indexOf(value) === index }
  const groups = events.map(e => e.owner_group.name).sort().filter(onlyUnique)

  return (
  <>
    <Toolbar>
      {mobile ? (
      <Menu onCheckedValueChange={(e,data) => setFilter(parseInt(data.name))}>
        <MenuTrigger>
          <MenuButton>{strings.filter}</MenuButton>
	</MenuTrigger>
        <MenuPopover>
          <MenuList>
	    <MenuItemRadio name="0" value="">{strings.all}</MenuItemRadio>
	    <MenuItemRadio name="1" value="">{strings.events}</MenuItemRadio>
	    <MenuItemRadio name="2" value="">{strings.practices}</MenuItemRadio>
	    <MenuItemRadio name="3" value="">{strings.trainings}</MenuItemRadio>
	    <MenuItemRadio name="4" value="">{strings.others}</MenuItemRadio>
          </MenuList>
        </MenuPopover>
      </Menu>
      ) : (
      <>
      <ToggleButton className={classes.menubutton} icon={<Calendar24Regular />} appearance="subtle" checked={filter === 0} onClick={() => setFilter(0)}>{strings.all}</ToggleButton>
      <ToggleButton className={classes.menubutton} icon={<Calendar24Regular />} appearance="subtle" checked={filter === 1} onClick={() => setFilter(1)}>{strings.events}</ToggleButton>
      <ToggleButton className={classes.menubutton} icon={<Calendar24Regular />} appearance="subtle" checked={filter === 2} onClick={() => setFilter(2)}>{strings.practices}</ToggleButton>
      <ToggleButton className={classes.menubutton} icon={<Calendar24Regular />} appearance="subtle" checked={filter === 3} onClick={() => setFilter(3)}>{strings.trainings}</ToggleButton>
      <ToggleButton className={classes.menubutton} icon={<Calendar24Regular />} appearance="subtle" checked={filter === 4} onClick={() => setFilter(4)}>{strings.others}</ToggleButton>
      </>
      ) }
      <Menu onCheckedValueChange={(e,data) => setGroupFilter(data.name)}>
        <MenuTrigger>
          <MenuButton appearance="subtle">Ryhmä</MenuButton>
	</MenuTrigger>
        <MenuPopover>
          <MenuList>
	    <MenuItemRadio name="none" value="">{strings.all}</MenuItemRadio>
	    { groups.map(g => (
              <MenuItemRadio name={g} value={g}>{g}</MenuItemRadio>
	    ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    </Toolbar>
    <Table>
        <TableHeader>
          <TableRow className={classes.root}>
            <TableHeaderCell key="name" className={classes.root}>
              {strings.event}
            </TableHeaderCell>
            <TableHeaderCell key="time" className={classes.root}>
              {strings.time}
            </TableHeaderCell>
	    { mobile ?
	    (
	      <></>
	    ) : (
	    <>
            <TableHeaderCell key="location" className={classes.root}>
              {strings.location}
            </TableHeaderCell>
            <TableHeaderCell key="owner" className={classes.root}>
              {strings.owner_group}
            </TableHeaderCell>
            <TableHeaderCell key="signups" className={classes.participants}>
              Osallistujat
            </TableHeaderCell>
	    </>
	    ) }
        </TableRow>
      </TableHeader>
      <TableBody>
        { events.filter((e) => getDate(e.end_time).getTime() > (Date.now() - 48 * 3600 * 1000)).filter((e) => filter === 0 || e.type_id === filter).filter((e) => groupFilter === "none" || e.owner_group.name === groupFilter).filter((e) => search === "" || e.name.toLowerCase().includes(search)).map((event) => (
	    <EventDetails id={event.id} key={event.id} mobile={mobile} popup={false} />
        ))}
      </TableBody>
    </Table>
  </>
  )
}

