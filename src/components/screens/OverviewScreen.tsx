import React from "react"
import { useWindowSize } from "react-use"
import { Card, makeStyles,tokens } from "@fluentui/react-components"
import { Header } from "./../Header"
import { EventTable } from "./../EventTable"
import { EventCalendar } from "./Calendar"
import { Login } from "./../Login"
import { useAppSelector } from "./../../hooks"

const useStyles = makeStyles({
  root: {
    height: "200px",
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    boxShadow: "0px 19px 38px 0px rgba(0,0,0,0.3)",
    marginTop: tokens.spacingVerticalMNudge,
    marginLeft: tokens.spacingHorizontalMNudge,
    borderBottomStyle: "none",
  },
  events: {
    width: "100%",
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  }

})

const Overview = () => {
  const classes = useStyles()
  const appSelector = useAppSelector
  const { width } = useWindowSize();
  const mobile = width < 768;
  const id = appSelector(state => state.login.id)
  const calendar = appSelector(state => state.login.usecalendar)

  return id > -1 ? (
    <>
      <Header mobile={mobile} width={width} />
      { calendar ? (
      <EventCalendar/>
      ) : (
      <Card className={classes.events}>
        <EventTable mobile={mobile}/>
      </Card>
      )}
    </>
  ) : (
    <Login />
  )
}

export default Overview
