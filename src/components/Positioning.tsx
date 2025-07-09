import React, { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "../hooks"
import {
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogSurface,
  DialogBody,
  ToggleButton,
  makeStyles,
  tokens,
  Input
} from "@fluentui/react-components"
import { DismissFilled, LocationRegular, LocationOffRegular } from "@fluentui/react-icons"
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet"
import { useMap, useMapEvent } from 'react-leaflet'
import { LatLngExpression, LatLngBoundsExpression } from "leaflet"
import { LogEntryResponseData, EventData, Position } from "../services/models"
import { positioning, stopPositioning } from "../services/users"
import { getPositions, getPositionsByCode } from "../services/events"
import { setMyPosition } from "../redux/slices/eventSlice"
import { strings } from "../localization"
import 'leaflet/dist/leaflet.css'
import BackgroundGeolocation from "cordova-background-geolocation-plugin";

interface Props {
  event?: EventData
}

interface PositionsProps {
  positions: {[key: number]: Position }
}

const windowSize = 0.002

const originalBounds: LatLngBoundsExpression = [[59.5174, 21.2927], [66.726, 32.437]] as LatLngBoundsExpression

const useStyles = makeStyles({
  root: {
    marginTop: tokens.spacingVerticalS,
    marginRight: tokens.spacingHorizontalS,
  },
  headerButtons: {
    marginLeft: tokens.spacingHorizontalMNudge,
    float: "right",
  },
  input: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    marginRight: tokens.spacingHorizontalS,
    width: "90px",
  },
  inputCode: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    marginRight: tokens.spacingHorizontalS,
    width: "140px",
  },
  submit: {
    color: tokens.colorPaletteRedForeground1,
  },
  visible: {
    marginTop: tokens.spacingVerticalS,
    marginRight: tokens.spacingHorizontalS,
    display: "block",
  },
  hidden: {
    marginTop: tokens.spacingVerticalS,
    marginRight: tokens.spacingHorizontalS,
    display: "none",
  },
})

export const Positioning: React.FC<Props> = ({event}) => {
  const classes = useStyles()
  const appSelector = useAppSelector
  const appDispatch = useAppDispatch()
  const user = appSelector(state => state.login)
  const positions = appSelector(state => state.events.positions)
  const logs = appSelector(state => state.events.logs)
  const currentSignup = event && event.event_users.filter(eu => eu.user && eu.user.id === user.id && eu.role_id < 10)[0]
  const [position, setPosition] = useState(true)
  const [mapBounds, setMapBounds] = useState(originalBounds)
  const [zoomed, setZoomed] = useState(false)
  const [code, setCode] = useState("")
  const [nickname, setNickname] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [intervalCounter, setIntervalCounter] = useState(0)
  const [cordova, setCordova] = useState(true)

  const doCurrentLocation = () => {
    if (cordova) {
      BackgroundGeolocation.getCurrentLocation((location) => {
        const lat = location.latitude
        const lon = location.longitude
        setMapBounds([[lat - windowSize, lon - windowSize], [lat + windowSize, lon + windowSize]] as LatLngBoundsExpression)
        appDispatch(setMyPosition({
          id: (currentSignup ? ("" + currentSignup.id) : "-1"),
          nickname: nickname,
          latitude: lat,
          longitude: lon
        }))
      }, (error) => {
        setCordova(false)
      }, {})
    } else {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          console.log("Current location: " + lat + ", " + lon)
          setMapBounds([[lat - windowSize, lon - windowSize], [lat + windowSize, lon + windowSize]] as LatLngBoundsExpression)
          appDispatch(setMyPosition({
            id: (currentSignup ? ("" + currentSignup.id) : "-1"),
            nickname: nickname,
            latitude: lat,
            longitude: lon
          }))
        }, (error) => {
        }, {})
      }
    }
  }

  useEffect(() => {
    if (event || code !== "") {
      if (event) {
        appDispatch(getPositions(event.id))
      } else {
        appDispatch(getPositionsByCode(code))
      }
      doCurrentLocation()
      const intervalId = setInterval(() => {
        if (intervalCounter === 0) {
          if (event) {
            appDispatch(getPositions(event.id))
          } else {
            appDispatch(getPositionsByCode(code))
          }
        }

        if (dialogOpen || intervalCounter === 0) {
          doCurrentLocation()
        }

        setIntervalCounter((intervalCounter + 1) % (dialogOpen ? 6 : 12))
      }, 5000)
      return () => clearInterval(intervalId)
    }
  }, [code, appDispatch, intervalCounter, currentSignup, dialogOpen, nickname])

  const toggle = () => {
    // @ts-ignore
    const operation = document.getElementById('operationcode').value
    // @ts-ignore
    const nick = document.getElementById('nickname').value
    setCode(operation)
    setNickname(nick)
    setPosition(!position)
    if (user.id > -1) {
      if (position && currentSignup) {
        positioning(currentSignup.id, currentSignup.nickname)
      } else {
        stopPositioning()
      }
    } else {
      if (position) {
        positioning(
            0,
            nick,
            operation
        )
      } else {
        stopPositioning()
      }
    }
  }

  const SetPositions: React.FC<PositionsProps> = ({positions}) => {
    const map = useMap()
    useMapEvent('zoomend', () => {
      setZoomed(true)
    })
    if (!zoomed) {
      map.fitBounds(mapBounds)
    }
    return (
        <>
          {positions && Object.values(positions).map((p: Position) => (
            <CircleMarker center={{lat: p.latitude, lng: p.longitude} as LatLngExpression} radius={10} color={"red"}><Tooltip offset={[10,0]} direction={"right"} permanent>{p.nickname}</Tooltip></CircleMarker>
          ))}
          {logs && Object.values(logs).map((l: LogEntryResponseData) => (
              <CircleMarker center={{lat: l.latitude, lng: l.longitude} as LatLngExpression} radius={10} color={"blue"}><Tooltip offset={[10,0]} direction={"right"} permanent>{l.entry}</Tooltip></CircleMarker>
          ))}
        </>
    )
  }

  return (
      <Dialog open={dialogOpen} onOpenChange={(event, data) => { setDialogOpen(data.open); setZoomed(false); }}>
        <DialogTrigger><Button appearance={position ? 'secondary' : 'primary'} className={classes.root} icon={position ? <LocationOffRegular/> : <LocationRegular/>} /></DialogTrigger>
        <DialogSurface>
          <DialogBody>
            <DialogContent >
              <MapContainer style={{height: "250px"}} bounds={mapBounds} scrollWheelZoom={false} attributionControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <SetPositions positions={positions}/>
              </MapContainer>
              <form>
                <div style={{marginTop: "10px"}}>
                  <Input id="operationcode" name="operationcode" defaultValue={code} placeholder={strings.operation_code} type="text" className={classes.inputCode} style={{visibility: (user.id > -1 ? "hidden" : "visible")}}/>
                  <Input id="nickname" name="nickname" type="text" defaultValue={nickname} placeholder={strings.team_id} className={classes.input} style={{visibility: (user.id > -1 ? "hidden" : "visible")}}/>
                  <ToggleButton className={classes.headerButtons} appearance={position ? "secondary" : "primary"} onClick={toggle} checked={position} icon={position ? <LocationOffRegular/> : <LocationRegular/>}/>
                  <DialogTrigger disableButtonEnhancement>
                    <Button className={classes.headerButtons} appearance="secondary" icon={<DismissFilled/>}/>
                  </DialogTrigger>
                </div>
              </form>
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
  )
}
