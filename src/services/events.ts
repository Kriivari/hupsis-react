import axios from "axios"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { Dates, EventData, EventUserData, SignupData, LogEntryData, EventLogEntryData } from "./models"
import { getURL } from "../util"

axios.defaults.withCredentials = false
const baseUrl = getURL("events")
const signupUrl = getURL("event_users")
const codesUrl = getURL("entry_codes")

export const getCodes = createAsyncThunk(
  "events/codes",
  async () => {
    const res = await axios.get(codesUrl + ".json")
    return res.data.data
  }
)

export const doLog = createAsyncThunk(
  "events/log",
  async (entry: LogEntryData, thunkAPI) => {
    const res = await axios.post(baseUrl + "/" + entry.event_id + "/log_entry.json",
      { "log": entry,
        "commit": "save"
      })
    return res.data
  }
)

export const doEventLog = createAsyncThunk(
  "events/event_log",
  async (entry: EventLogEntryData, thunkAPI) => {
    const res = await axios.post(baseUrl + "/" + entry.event_id + "/log.json",
      { "log": entry,
        "commit": "save"
      })
    return res.data
  }
)

export const getEvent = (id: number) => {
  return axios.get(baseUrl + "/" + id + ".json")
}

// returns all events in the database
export const getAll = createAsyncThunk(
  "events/getAll",
  async (dates: Dates) => {
    const params = { fast_json: true, start_date: dates.start.toISOString().split("T")[0], end_date: dates.end.toISOString().split("T")[0] }
    const res = await axios.get(baseUrl + ".json", { params: params })
    const dirty:EventData[] = res.data
    const cleaned:EventData[] = []
    const ids:number[] = []
    dirty.forEach(ev => {
      if (!ids.includes(ev.id)) {
        ids.push(ev.id)
	cleaned.push(ev)
      }
    })
    return {events: cleaned, startDate: dates.start.toISOString().split("T")[0]}
  }
)

export const getMore = createAsyncThunk(
  "events/getMore",
  async (dates: Dates) => {
    const params = { start_date: dates.start.toISOString().split("T")[0], end_date: dates.end.toISOString().split("T")[0] }
    const res = await axios.get(baseUrl + ".json", { params: params })
    const dirty:EventData[] = res.data
    const cleaned:EventData[] = []
    const ids:number[] = []
    dirty.forEach(ev => {
      if (!ids.includes(ev.id)) {
        ids.push(ev.id)
	cleaned.push(ev)
      }
    })
    return {events: cleaned, startDate: dates.start.toISOString().split("T")[0]}
  }
)

// sign up to an event
export const doSignup = createAsyncThunk(
  "events/signup",
  async (signup: SignupData, thunkAPI) => {
    const {eventId, shiftId, signupId, startTime, endTime, comments, type} = signup
    const roleId: number = type === "coming" ? 6 : 16
    if (signupId > -1) {
      await axios.put(signupUrl + "/" + signupId + ".json",
      { "event_user":
        {
          "comments": comments,
          "start_time": startTime,
          "end_time": endTime,
	  "role_id": roleId
        },
      })
    } else {
      await axios.post(signupUrl + ".json",
      { "event_user":
        {
          "shift_id": shiftId,
          "comments": comments,
          "start_time": startTime,
          "end_time": endTime,
	  "role_id": roleId
        },
        "commit": "signup"
      })
    }
    const res = await axios.get(baseUrl + "/" + eventId + ".json").then((response) => response)
    return res.data
  }
)

export const deleteSignup = createAsyncThunk(
  "events/deleteSignup",
  async (signup: SignupData, thunkAPI) => {
    await axios.delete(signupUrl + "/" + signup.signupId + ".json")
    const res = await axios.get(baseUrl + "/" + signup.eventId + ".json").then((response) => response)
    return res.data
  }
)

export const changeSignup = createAsyncThunk(
  "events/changeSignup",
  async (signup: SignupData, thunkAPI) => {
    const {eventId, signupId, roleId, startTime, endTime, comments, confirmed, mileage, cost_explanation, type} = signup
    if (signupId > -1) {
      //await axios.delete(signupUrl + "/" + signupId + ".json")
    }
    await axios.put(signupUrl + "/" + signupId + ".json",
    { "event_user":
      {
        "mileage": mileage,
	"cost_explanation": cost_explanation,
        "comments": comments,
	"confirmed": confirmed,
        "start_time": startTime,
        "end_time": endTime,
        "role_id": (type === "notcoming" ? 16 : roleId)
      },
      "commit": "signup"
    })
    const res = await axios.get(baseUrl + "/" + eventId + ".json").then((response) => response)
    return res.data
  }
)

export const eventUsers = async (id: number): Promise<EventUserData[]> => {
  const res = await axios.get(`${baseUrl}/${id}/users`)
  return res.data
}

// creates new event
export const createEvent = async (
  startTime: string,
  endTime: string,
  name: string
) => {
  const newEvent = [
    {
      startTime,
      endTime,
      name
    }
  ]

  const res = await axios.post(baseUrl, newEvent)
  return res
}

// deletes event with given id
export const deleteById = async (id: number) => {
  const res = await axios.delete(`${baseUrl}/${id}`)
  return res
}

export const updateEvent = async (currentId: number, updatedFields: object) => {
  const res = await axios.patch(`${baseUrl}/${currentId}`, updatedFields)
  return res
}

