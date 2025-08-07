import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './slices/AuthSlice'
import { myMeetingReducer } from '../pages/MyMeetings/MyMeetingSlice'
import { meetingsReducer } from '../pages/Meetings/MeetingsSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    mymeetings: myMeetingReducer,
    meetings: meetingsReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch