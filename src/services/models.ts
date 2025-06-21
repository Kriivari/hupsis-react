export interface GetEventData {
  events: EventData[]
  startDate: string
}

export interface Dates {
  start: Date
  end: Date
}

export interface Code {
  code: string
  firstaid: string
}

export interface LogEntryData {
  event_id?: number
  id?: number
  age: number
  reason: string
  details?: string
  firstaid: string
  future?: string
  destination?: string
  medicine: boolean
  form: boolean
  notes?: string
  usage?: string
  user: string
  time: string
}

export interface EventLogEntryData {
  event_id?: number
  id?: number
  entry: string
  user: string
  time: string
  latitude?: number
  longitude?: number
}

export interface LogResponse {
  id: number
}
  
export interface QualificationData {
  id: number
  name: string
}

export interface UserData {
  id: number
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
  volunteer?: boolean
  trainee?: boolean
  default_mileage?: number
  usecalendar?: boolean
  currentStart?: Date
  eagroups?: UserGroupData[]
  home_groups_light?: GroupData[]
  home_groups?: GroupData[]
  eagroup_users?: UserGroupData[]
  qualifications?: QualificationData[]
}

export interface EventData {
  id: number
  name: string
  location: string
  city: string
  type_id: number
  status: number
  visibility: number
  start_time: Date
  end_time: Date
  required: number
  missing: number
  cars: number
  trainee: boolean
  food: boolean
  is_open: boolean
  details: string
  details_markdown: string
  confirmed_notes_markdown: string
  close_time: string
  created_at: string
  updated_at: string
  private: boolean
  global: boolean
  groupfood: boolean
  subtype: number
  subsubtype: number
  first_responder: boolean
  nda_required: boolean
  hide_travel_costs: boolean
  owner_group: GroupData
  event_shifts: EventShiftData[]
  event_users: EventUserData[]
  full_signups: EventUserData[]
  filtered_log_entries?: LogEntryData[]
}

export interface GroupData {
  id: number
  name: string
  type_id?: number
  firstaid?: boolean
}

export interface UserGroupData {
  id: number
  name: string
  role: number
}

export interface EventShiftData {
  id: number
  event_id: number
  name: string
  start_time: Date
  end_time: Date
  close_time: Date
  close_cancellations_time: Date
  is_open: boolean
  required: number
  missing: number
  qualification_id: number
  event_users: EventUserData[]
}

export interface EventUserData {
  id: number
  event_shift_id: number
  role_id: number
  last_name: string
  first_name: string
  phone: string
  email: string
  start_time: Date
  end_time: Date
  hours: number
  trainee: boolean
  confirmed: boolean
  original_start_time: Date
  original_end_time: Date
  comments: string
  mileage: number
  perdiem: number
  cost_explanation: string
  nickname: string
  latitude: string
  longitude: string
  home_groups: Group[]
  subroles: string[]
  user: UserData
}

export interface Group {
  id: number
  name: string
}

export interface SignupData {
  eventId: number
  shiftId: number
  signupId: number
  roleId: number
  startTime: string
  endTime: string
  comments: string
  confirmed?: boolean
  mileage?: number
  cost_explanation?: string
  type: string
}

export interface EventMessage {
  eventId: number
  shifts?: string[]
  title?: string
  content: string
  distribution: number
}

export interface Position {
  latitude: number
  longitude: number
  nickname: string
  id?: number
}

export interface PositionsLogs {
  locations: Position[]
  logs: EventLogEntryData[]
}