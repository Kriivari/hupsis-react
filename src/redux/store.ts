import { configureStore } from "@reduxjs/toolkit"
import storage from "redux-persist/lib/storage"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import eventsReducer from "./slices/eventSlice"
import loginReducer from "./slices/loginSlice"

const persistConfig = {
  key: "root",
  version: 1,
  storage
}

const persistedReducer = persistReducer(persistConfig, loginReducer)

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    login: persistedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
