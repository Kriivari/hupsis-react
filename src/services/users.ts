import { createAsyncThunk } from "@reduxjs/toolkit"
import BackgroundGeolocation from "../../node_modules/cordova-background-geolocation-plugin"
import axios from "axios"
import { getURL } from "../util"
import { UserData } from "./models"

axios.defaults.withCredentials = true
const baseUrl = getURL('')

const calendar = async (state: boolean): Promise<boolean> => {
  return state
}

const login = async (email: string, password: string): Promise<UserData> => {
  stopPositioning()
  const res = await axios.post(baseUrl + "users/sign_in.json", {email: email, password: password}, {auth: {username: email, password: password}})
  const user = res.data
  user.password = password
  axios.interceptors.request.use((config) => {
    config.auth = {username: email, password: password}
    return config
  })
  return user
}

const logout = createAsyncThunk(
  "users/logout",
  async (thunkAPI) => {
    stopPositioning()
    axios.interceptors.request.clear()
    const res = await axios.delete(baseUrl + "users/sign_out.json")
    return res.data
  }
)
  
// returns all users in the database
const getAll = async (): Promise<UserData[]> => {
  return await axios.get(baseUrl)
}

// returns user with the given username
const getByUsername = async (username: string): Promise<UserData> => {
  return await axios.get(`${baseUrl}/${username}`)
}

// returns users with the given email
const getByEmail = async (email: string): Promise<UserData[]> => {
  return await axios.get(`${baseUrl}/search?email=${email}`)
}

// creates new user
const createUser = async (
  id: number,
  firstName: string,
  lastName: string,
  login: string,
  email: string
) => {
  const newUser = {
    id,
    firstName,
    lastName,
    ldap: login,
    email
  }
  return await axios.post(baseUrl, newUser)
}

const positioning = (id: number, nick: string, code?: string) => {
      BackgroundGeolocation.configure({
        locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
        desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
        stationaryRadius: 10,
        distanceFilter: 10,
        notificationTitle: 'Background tracking',
        notificationText: 'enabled',
        debug: false,
        stopOnTerminate: true,
        interval: 10000,
        fastestInterval: 5000,
        activitiesInterval: 10000,
        url: getURL('location.json'),
        // customize post properties
        postTemplate: {
            latitude: '@latitude',
            longitude: '@longitude',
            id: id,
            nickname: nick,
	        code: code
        }
      })
    BackgroundGeolocation.start()
}

const stopPositioning = () => {
    BackgroundGeolocation.stop()
}

export { getAll, getByUsername, getByEmail, createUser, login, logout, calendar, positioning, stopPositioning }

