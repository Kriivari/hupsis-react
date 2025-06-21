import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { persistor, store } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"
import App from "./App"
import "./assets/fonts/Syne-Bold.otf"
import "./assets/fonts/Syne-Regular.otf"
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components'
//import * as serviceWorker from './serviceWorker'

declare global {
  interface Window { cordova: any; }
}

window.cordova = window.cordova || false

const renderReactDom = () => {
  const container = document.getElementById("root")
  const root = createRoot(container!)
  root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <FluentProvider theme={teamsLightTheme}>
          <App />
        </FluentProvider>
      </PersistGate>
    </Provider>
  )
};

if (window.cordova) {
  document.addEventListener('deviceready', () => {
    renderReactDom()
    
  }, false)

} else {
  renderReactDom()
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();

