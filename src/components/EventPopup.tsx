import React from "react"
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Table, TableBody } from "@fluentui/react-components"
import { DismissFilled } from "@fluentui/react-icons"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import { EventData } from "./../services/models"
import EventDetails from "./EventDetails"

interface Props {
  event: EventData
  modalState: boolean
  setModalState: Function
}

export const EventPopup: React.FC<Props> = ({event, modalState, setModalState}) => {
  return (
        <Dialog open={modalState} onOpenChange={(event, data) => {setModalState(data.open)}}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
	        <Row>
	          <Col xs={10} md={6}>{event.name}</Col>
	          <Col xs={1} md={4} className="d-none d-sm-none d-md-block">{event.location}</Col>
		  <Col xs={1}>
                    <DialogActions>
                      <DialogTrigger disableButtonEnhancement>
                        <Button appearance="secondary" icon={<DismissFilled/>}/>
                      </DialogTrigger>
		    </DialogActions>
		  </Col>
	        </Row>
            </DialogTitle>
	    <DialogContent>
	      <Table>
	        <TableBody>
  	          <EventDetails id={event.id} mobile={true} popup={true} />
	        </TableBody>
	      </Table>
            </DialogContent>
          </DialogBody>
	</DialogSurface>
      </Dialog>
  )
}
