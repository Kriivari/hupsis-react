import { Dispatch } from "redux"
import { UserData } from "./../../services/models"

const SET_LOGIN = "SET_LOGIN"

interface SetLoginAction {
  type: typeof SET_LOGIN
  loginCredentials: UserData
}

type LoginActionTypes = SetLoginAction

const loginReducer = (
  state: UserData = { id: -1, first_name: '', last_name: '', email: '', phone: '', password: '' },
  action: LoginActionTypes
) => {
  switch (action.type) {
    case SET_LOGIN:
      return action.loginCredentials
    default:
      return state
  }
}

export const updateLogin = (loginCredentials: UserData) => {

  return async (dispatch: Dispatch): Promise<void> => {
    console.log("Dispatching " + loginCredentials.id)
    dispatch({
      type: "SET_LOGIN",
      loginCredentials
    })
  }
}

export default loginReducer
