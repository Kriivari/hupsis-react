import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
  Code,
  EventData,
  EventLogEntryData,
  GetEventData,
  LogResponse,
  Position,
  PositionsLogs
} from "../../services/models"
import { doSignup, deleteSignup, changeSignup, getAll, getMore, getCodes, doLog, doEventLog, getPositions, getPositionsByCode } from "../../services/events"

type EventsState = {
  events: EventData[]
  codes: Code[]
  startDates: string[]
  loading: number
  calendar: boolean
  search: string
  currentLogId: number
  logs: EventLogEntryData[]
  positions: Position[]
  myPosition?: Position | null
}

const dayjs = require("dayjs-with-plugins")

const initialState: EventsState = {
  events: [],
  codes: [],
  startDates: [],
  loading: -1,
  calendar: false,
  search: "",
  currentLogId: -1,
  positions: [],
  logs: [],
  myPosition: null
}

function updateMe(positions: Position[], me: Position) {
  for (let i = 0; i < positions.length; i++) {
    const p = positions[i]
    if (checkMine(p, me)) {
      positions[i] = me
    }
  }
}
function checkMine(position: Position, me: Position): boolean {
  return ((me.id && me.id > -1) && position.id === me.id) || ((!me.id || me.id === -1) && position.nickname === me.nickname)
}

function updateArray(originalArray: any[], newArray: any[], myEntry?: any): void {
  for (let i = 0; i < newArray.length; i++) {
    let found = false
    for (let j = 0; j < originalArray.length; j++) {
      if (originalArray[j].id === newArray[i].id) {
        if (!myEntry || !checkMine(originalArray[j], myEntry)) {
          if (originalArray[j].latitude !== newArray[i].latitude || originalArray[j].longitude !== newArray[i].longitude) {
            originalArray[j] = newArray[i]
          }
        }
        found = true
        break;
      }
    }
    if (!found) {
      originalArray.push(newArray[i])
    }
  }
}

const updateEvents = (state: EventsState, action: PayloadAction<EventData>) => {
      state.loading = -1
      const events = state.events
      for (let i = 0; i < events.length; i++) {
        if (events[i] && (action.payload as EventData).id === events[i].id) {
          //newEvents.push(action.payload)
	  events[i] = action.payload
	} else {
	  //newEvents.push(events[i])
	}
      }
    }

export const eventsSlice = createSlice({
  name: 'events',
  initialState: initialState,
  reducers: {
    setCalendar: (state: any, action: any) => {
      state.calendar = action.payload
    },
    setMyPosition: (state: any, action: PayloadAction<Position>) => {
      state.myPosition = action.payload
      updateMe(state.positions, action.payload)
    },
    replaceEvents: (state: any, action: any) => {
      action.payload.forEach((ev: EventData) => {
        for (let i = 0; i < state.events.length; i++) {
	  if (ev.id === state.events[i].id) {
	    state.events[i] = ev
	    break
	  }
	}
      })
    },
    replaceEvent: (state: any, action: any) => {
      for (let i = 0; i < state.events.length; i++) {
        if (action.payload.id === state.events[i].id) {
          state.events[i] = action.payload
	  break
	}
      }
    },
    addEvent: (state: any, action: any) => {
      state.events.push(action.payload)
    },
    removeEvent: (state: any, action: any) => {
      for (let i = 0; i < state.events.length; i++) {
        if (action.payload.id === state.events[i].id) {
          state.events[i] = null
	  break
	}
      }
    },
    getEvents: (state: any) => {
      return state.events
    },
    getEvent: (state: any, action: any) => {
      return state.events.filter((e: EventData) => e.id === action.payload)
    },
    doSearch: (state: any, action: any) => {
      state.search = action.payload.toLowerCase()
    },
    clearEvents: (state: any) => {
      state.events = []
      state.codes = []
      state.startDates = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getCodes.fulfilled, (state: EventsState, action: PayloadAction<Code[]>) => {
      state.codes = action.payload
    })
    .addCase(getPositions.fulfilled, (state: EventsState, action: PayloadAction<PositionsLogs>) => {
      if (state.positions.length > 0) {
        updateArray(state.positions, action.payload.locations, state.myPosition)
      } else {
        state.positions = action.payload.locations
      }
      if (state.logs.length > 0) {
        updateArray(state.logs, action.payload.logs)
      } else {
        state.logs = action.payload.logs
      }
    })
    .addCase(getPositionsByCode.fulfilled, (state: EventsState, action: PayloadAction<PositionsLogs>) => {
      if (state.positions.length > 0) {
        updateArray(state.positions, action.payload.locations, state.myPosition)
      } else {
        state.positions = action.payload.locations
      }
      if (state.logs.length > 0) {
        updateArray(state.logs, action.payload.logs)
      } else {
        state.logs = action.payload.logs
      }
    })
    .addCase(getAll.fulfilled, (state: EventsState, action: PayloadAction<GetEventData>) => {
      state.events = action.payload.events
    })
    .addCase(getMore.fulfilled, (state: EventsState, action: PayloadAction<GetEventData>) => {
      state.startDates.push(action.payload.startDate)
      const payload = action.payload.events
      if (state.events.length === 0) {
        state.events = payload
      } else if (payload.length > 0) {
        let payloadIndex = 0
	      const ids = state.events.map(e => e.id)
	      let filtered = payload.filter(e => ids.indexOf(e.id) === -1)
        for (let i = 0; i < state.events.length; i++) {
	        const currentStart = dayjs(state.events[i].start_time).toDate()
	        for (; payloadIndex < filtered.length; payloadIndex++) {
	          const payloadStart = dayjs(filtered[payloadIndex].start_time).toDate()
	          if (payloadStart > currentStart) {
	            break;
            }
	          state.events.splice(i, 0, filtered[payloadIndex])
	        }
	      }
      }
    })
    .addCase(doSignup.rejected, (state) => {
      state.loading = -1
    })
    .addCase(doSignup.fulfilled, updateEvents)
    .addCase(deleteSignup.rejected, (state) => {
      state.loading = -1
    })
    .addCase(deleteSignup.fulfilled, updateEvents)
    .addCase(changeSignup.rejected, (state) => {
      state.loading = -1
    })
    .addCase(changeSignup.fulfilled, updateEvents)
    .addCase(doLog.fulfilled, (state: EventsState, action: PayloadAction<LogResponse>) => {
      state.currentLogId = action.payload.id
    })
    .addCase(doEventLog.fulfilled, updateEvents)
  }
})

export const { doSearch, clearEvents, replaceEvents, replaceEvent, addEvent, removeEvent, setMyPosition } = eventsSlice.actions

export default eventsSlice.reducer
