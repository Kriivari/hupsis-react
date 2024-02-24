import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { EventData, SignupData } from "./../services/models"
import { getURL } from "./../util"

type EventsResponse = EventData[]

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: getURL(""),
  }),
  tagTypes: ['Events'],
  endpoints: (build) => ({
    getEvents: build.query<EventsResponse, void>({
      query: () => ({ url: "events.json" }),
      providesTags: (result) =>
        result ? result.map(({ id }) => ({ type: "Events", id })) : [],
    }),
    getEvent: build.query<EventData, number>({
      query: (id) => ({ url: `events/${id}.json` }),
    }),
    addSignup: build.mutation<SignupData, Partial<SignupData>>({
      query: (body) => ({ url: "events.json", method: "POST", body }),
    }),
  }),
})

