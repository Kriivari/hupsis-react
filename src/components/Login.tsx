import React, { useState } from 'react'
import { Button, Card, Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Input, Title2, makeStyles, tokens } from '@fluentui/react-components'
import { login } from "../services/users"
import { useAppDispatch } from "../hooks"
import { doLogin } from "../redux/slices/loginSlice"
import { strings } from "../localization"
import { Positioning } from "./Positioning"

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
  const [errorOpen, setErrorOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (formEvent: FormElem): Promise<void> => {
    formEvent.preventDefault();
    setIsLoading(true);
    try {
      const email = (formEvent.currentTarget.elements.namedItem('email') as HTMLInputElement).value
      const password = (formEvent.currentTarget.elements.namedItem('password') as HTMLInputElement).value

      const data = await login(email, password)
      dispatch(doLogin(data))
    } catch (error) {
      setErrorOpen(true)
    } finally {
      setIsLoading(false)
    }
  }


  return(
      <Card className={classes.root}>
        <Title2 className={classes.root}>{ strings.sign_in }</Title2>
        <form onSubmit={handleLogin}>
          <Input id="email" name="email" placeholder={strings.email} type="text" className={classes.input}/><br />
          <Input id="password" name="password" type="password" placeholder={strings.password} className={classes.input}/><br />
          <Button
              type="submit"
              className={classes.submit}
              disabled={isLoading}
          >
            {isLoading ? 'Kirjaudutaan...' : strings.sign_in_button}
          </Button>
        </form>
        <Positioning />
        <Dialog open={errorOpen} onOpenChange={(event, data) => setErrorOpen(data.open)}>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Kirjautuminen epäonnistui</DialogTitle>
              <DialogContent>
                Varmista käyttäjätunnuksesi ja salasanasi.
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Sulje</Button>
                </DialogTrigger>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </Card>
  )
}

