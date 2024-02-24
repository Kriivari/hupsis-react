import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserData } from "../../services/models"
import { logout } from "../../services/users"

const initialState: UserData = {
  id: -1,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  volunteer: false,
  trainee: false,
  default_mileage: 0,
  usecalendar: false,
  eagroups: [],
  home_groups: [],
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    doLogin: (state: any, action: PayloadAction<UserData>) => {
      state.id = action.payload.id
      state.first_name = action.payload.first_name
      state.last_name = action.payload.last_name
      state.email = action.payload.email
      state.password = action.payload.password
      state.phone = action.payload.phone
      state.volunteer = action.payload.volunteer
      state.trainee = action.payload.trainee
      state.default_mileage = action.payload.default_mileage
      state.usecalendar = action.payload.usecalendar
      state.eagroups = action.payload.eagroups
      state.home_groups = action.payload.home_groups
    },
    setCalendar: (state: any, action: PayloadAction<boolean>) => {
      state.usecalendar = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state: any) => {
      state.id = -1
      state.first_name = ''
      state.last_name = ''
      state.email = ''
      state.password = ''
      state.phone = ''
      state.volunteer = false
      state.trainee = false
      state.default_mileage = 0
      state.usecalendar = false
      state.eagroups = []
      state.home_groups = []
    })
  }
})

export const { doLogin, setCalendar } = loginSlice.actions

export default loginSlice.reducer

