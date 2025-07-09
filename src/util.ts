import { EventData, EventUserData, UserData } from "./services/models"

const dayjs = require("dayjs-with-plugins")

export function getURL(postfix: string): string {
  const baseURL = process.env.REACT_APP_BASE_URL
    ? process.env.REACT_APP_BASE_URL
    : "https://paivystykset.punainenristi.fi"
  //const baseURL = 'http://localhost:3000'
  if (!postfix.startsWith("/") && !baseURL.endsWith("/")) {
    postfix = "/" + postfix
  }
  return baseURL + postfix
}

export const getCredentials = async (): Promise<UserData> => {
  const credentials: UserData = {
    id: -1,
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  }
  return credentials
}

export const getDayjs = (date: Date | null | undefined) => {
  return date ? dayjs(date, "YYYY-MM-DD HH:mm:ss ZZ") : null
}
export const getDate = (date: Date | null | undefined) => {
  return date ? getDayjs(date).toDate() : null
}

export const parseHupsisTime = (original: Date | null | undefined, time: string): Date | null => {
  console.log("Parsing " + time)
  if (time.length > 5) {
    const res = dayjs(time).toDate()
    console.log("Parsing " + time + " to " + res)
    return res
  } else if (original) {
    const parts = time.split(":")
    original.setHours(parseInt(parts[0]))
    original.setMinutes(parseInt(parts[1]))
    return original
  }
  return null
}

export const formatDatePicker = (time?: Date): string => {
  return !time ? "" : getDayjs(time).format("DD.MM.YYYY")
}

export const formatISO = (time?: Date): string => {
  return !time ? "" : dayjs(time).format("YYYY-MM-DDTHH:mm:ss")
}

export const formatDate = (time?: Date): string => {
  return !time ? "" : `${getDate(time).toLocaleDateString("fi-FI", {day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit"})}`
}

export const formatDay = (time?: Date): string => {
  return !time ? "" : `${getDate(time).toLocaleDateString("fi-FI", {day: "numeric", month: "numeric"})}`
}

export const formatCalendarDay = (time?: Date): string => {
  return !time ? "" : getDayjs(time).format("YYYY-MM-DD")
}

export const formatCalendarTime = (time?: Date): string => {
  if (time) {
    const d = getDate(time)
    return (d.getHours() < 10 ? "0" : "") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes()
  }
  return ""
}

export const formatDateSpan = (startTime: Date, endTime: Date): string => {
  const now = new Date()
  const startDate = getDate(startTime)
  const endDate = getDate(endTime)
  const endDay = (endDate.getDate() > startDate.getDate() || endDate.getMonth() > startDate.getMonth() || endDate.getFullYear() > startDate.getFullYear()) ? `${endDate.toLocaleString("fi-FI", {day: "numeric", month: "numeric"})} ` : ""
  if (startDate.getFullYear() > now.getFullYear() && ((startDate.getFullYear()) - 1 > now.getFullYear() || (startDate.getMonth() - 1) > now.getMonth())) {
    return `${startDate.toLocaleDateString("fi-FI", {day: "numeric", month: "numeric", year: "2-digit", hour: "2-digit", minute: "2-digit"})} - ${endDay}${endDate.toLocaleString("fi-FI", {hour: "2-digit", minute: "2-digit"})}`
  }
  return `${startDate.toLocaleDateString("fi-FI", {day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit"})} - ${endDay}${endDate.toLocaleString("fi-FI", {hour: "2-digit", minute: "2-digit"})}`
}

export const formatTimeSpan = (startTime: Date, endTime: Date): string => {
  return `${getDayjs(startTime).format("HH:mm")} - ${getDayjs(endTime).format("HH:mm")}`
}

export const formatShortTimeSpan = (startTime: Date, endTime: Date): string => {
  return `${getDate(startTime).toLocaleDateString("fi-FI", {hour: "2-digit", minute: "2-digit", day: "numeric", month: "numeric"})} - ${getDate(endTime).toLocaleString("fi-FI", {hour: "2-digit", minute: "2-digit"})}`
}

export const formatHupsisTime = (time: Date | null | undefined): string => {
  if (time) {
    return `${time.toLocaleDateString("fi-FI", {day: "numeric", month: "numeric", year: "numeric", hour: "2-digit"})}:${(time.getMinutes() + "").padStart(2,'0')}`
  } else {
    return ""
  }
}

export const formatHupsisTimePart = (time?: Date): string => {
  if (time) {
    return `${(time.getHours() + "").padStart(2,'0')}:${(time.getMinutes() + "").padStart(2,'0')}`
  } else {
    return ""
  }
}

export const userSignups = (user: number, event: EventData): EventUserData[] => {
  return event.event_users.filter(u => u.user && u.user.id === user && u.role_id < 10)
}

export const eventBackgroundClass = (user: number, row: EventData) => {
    const signups = userSignups(user, row)
    if (signups.length > 0) {
      return "event-signedup"
    }
    if (!row.is_open) {
      return "event-closed"
    }
    if (row.missing > 0) {
      return "event-open"
    }
    return ""
  }

export const eventBackground = (user: number, row: EventData) => {
  const signups = userSignups(user, row)
  if (signups.length > 0) {
    return "#d0e0fa"
  }
  if (!row.is_open) {
    return "lightgrey"
  }
  if (row.missing > 0) {
    return "#d0eed0"
  }
  return "#fff"
}

export const getCSRFToken = () => {
    return unescape(document.cookie.split('=')[1])
}

export const sortByTimeAndName = (signups: EventUserData[]) => {
  return signups.sort((a,b):number => {
    if (a.start_time < b.start_time) {
      return -1
    }
    if (a.start_time > b.start_time) {
      return 1
    }
    const a1 = a.last_name + " " + a.first_name
    const b1 = b.last_name + " " + b.first_name
    if (a1 < b1) {
      return -1
    }
    if (a1 > b1) {
      return 1
    }
    return 0
  })
}

