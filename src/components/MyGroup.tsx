import React from "react"
import { Card, CardHeader, Table, TableRow, TableCell } from "@fluentui/react-components"
import { Calendar24Filled, Location24Filled } from "@fluentui/react-icons"
import { useAppSelector } from "./../hooks"
import { formatDay, formatShortTimeSpan } from "./../util"

export const MyGroup = () => {
  const appSelector = useAppSelector
  const login  = appSelector(state => state.login)
  return login.home_groups && login.home_groups.length > 0 ? (
    <Card className="w-25">
      <CardHeader>Oma ryhmä</CardHeader>
      <Table>
        <TableRow>
	  <TableCell className="w-25"><Calendar24Filled /></TableCell>
	  <TableCell>{login.home_groups[0].name}</TableCell>
	</TableRow>
      </Table>
    </Card>
  ) : (
    <div />
  )
}
