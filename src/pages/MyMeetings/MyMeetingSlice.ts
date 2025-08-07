import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Meeting } from '../../types/meeting'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firebaseDB } from '../../utils/FirebaseConfig';
import type { UserInfo } from '../../App/slices/AuthSlice';


export const fetcMyMeeting = createAsyncThunk(
    'MyMeetings/fetchMyMeetings',
    async (userInfo: UserInfo) => {
    const q = query(collection(firebaseDB, 'meetings'), where('createdBy', '==', userInfo?.uid));
    const snapshot = await getDocs(q);

    const meetingsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
        ...data,
        meetingId: doc.id,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString(): new Date().toISOString(),
        } as Meeting;
    });
    return meetingsData
  },
)

interface MyMeetingState {
  myMeetings: Meeting[],
  loading: boolean,
  error: string,
}

const initialState: MyMeetingState = {
  myMeetings: [],
  loading: false,
  error: '',
}

const MyMeetingSlice = createSlice({
  name: 'myMeetings',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(fetcMyMeeting.pending, (state) => {
       state.loading = true
       state.error = ''
    })
    builder.addCase(fetcMyMeeting.fulfilled, (state, action) => {
       state.loading = false
       state.myMeetings = action.payload
    })
     builder.addCase(fetcMyMeeting.rejected, (state, action) => {
       state.loading = false
       state.error = action.error.message || 'Failed to fetch meetings'
    })
  },
})

export const myMeetingReducer = MyMeetingSlice.reducer;