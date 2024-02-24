import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { getURL } from "../util"
import { UserData } from "./models"

axios.defaults.withCredentials = true
const baseUrl = getURL('')

const calendar = async (state: boolean): Promise<boolean> => {
  return state
}

const login = async (email: string, password: string): Promise<UserData> => {
  console.log("Signing in")
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
    axios.interceptors.request.clear()
    const res = await axios.delete(baseUrl + "users/sign_out.json")
    return res.data
  }
)
  
// returns all users in the database
const getAll = async (): Promise<UserData[]> => {
  const res = await axios.get(baseUrl)
  return res.data
}

// returns user with the given username
const getByUsername = async (username: string): Promise<UserData> => {
  const res = await axios.get(`${baseUrl}/${username}`)
  return res.data
}

// returns users with the given email
const getByEmail = async (email: string): Promise<UserData[]> => {
  const res = await axios.get(`${baseUrl}/search?email=${email}`)
  return res.data
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
  const res = await axios.post(baseUrl, newUser)
  return res
}

export { getAll, getByUsername, getByEmail, createUser, login, logout, calendar  }

