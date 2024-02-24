import React from 'react'
import { Button, Card, Input, Title2, makeStyles, tokens } from '@fluentui/react-components'
import { login } from "../services/users"
import { useAppDispatch } from "../hooks"
import { doLogin } from "../redux/slices/loginSlice"
import { strings } from "./../localization"

type FormElem = React.FormEvent<HTMLFormElement>

const useStyles = makeStyles({
  root: {
    textAlign: "center",
    color: "white",
    backgroundColor: tokens.colorPaletteRedForeground1,
  },
  input: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    marginBottom: tokens.spacingVerticalMNudge,
  },
  submit: {
    color: tokens.colorPaletteRedForeground1,
  },
})

export const Login = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  
  const handleLogin = (formEvent: FormElem): void => {
    const email = (formEvent.currentTarget.elements[0] as HTMLInputElement).value
    const password = (formEvent.currentTarget.elements[1] as HTMLInputElement).value

    login(email, password).then(
      (data) => {
        dispatch(doLogin(data))
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
      }
    );
    formEvent.preventDefault()
  }
  
  return(
    <Card className={classes.root}>
      <Title2 className={classes.root}>{ strings.sign_in }</Title2>
      <form onSubmit={handleLogin}>
	<Input id="email" name="email" placeholder={strings.email} type="text" className={classes.input}/><br />
        <Input id="password" name="password" type="password" placeholder={strings.password} className={classes.input}/><br />
        <Button type="submit" className={classes.submit}>{ strings.sign_in_button }</Button>
      </form>
    </Card>
  )
}

