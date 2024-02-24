import 'babel-polyfill'
import React from "react"
import { connect } from "react-redux"
import {
  HashRouter as Router,
  Routes,
  Route
} from "react-router-dom"
import axios from "axios"
import dayjs from "dayjs"
import Overview from "./components/screens/OverviewScreen"
import EventDetailsScreen from "./components/screens/EventDetailsScreen"
import Logout from "./components/Logout"
import { updateLogin } from "./redux/reducers/loginReducer"
import { UserData } from "./services/models"
import { getAll, getCodes } from "./services/events"
import { useAppSelector, useAppDispatch } from "./hooks"
import "./index.scss"

interface Props {
  updateLogin: (credentials: UserData) => void
  loginCredentials: UserData
}

const App = ({ loginCredentials, ...props }: Props) => {
  const dispatch = useAppDispatch()
  const appSelector = useAppSelector
  const login = appSelector(state => state.login)
  if (login.id > -1) {
    axios.interceptors.request.use((config) => {
      config.auth = {username: login.email, password: login.password}
      return config
    })
    dispatch(getAll({start: dayjs().startOf("month").toDate(), end: dayjs().add(10, "year").startOf("month").toDate()}))
    dispatch(getCodes())
  }
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/event/:id" element={<EventDetailsScreen />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
  )
}

const mapStateWithProps = (state: Props) => {
  return {
    loginCredentials: state.loginCredentials
  }
}

export default connect(mapStateWithProps, {
  updateLogin
})(App)

