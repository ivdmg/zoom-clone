import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Meeting } from '../../types/meeting'
import { collection, getDocs, query, where, or } from 'firebase/firestore';
import { firebaseDB } from '../../utils/FirebaseConfig';
import type { UserInfo } from '../../App/slices/AuthSlice';

export const fetchMeetings = createAsyncThunk(
    'Meetings/fetchMeetings',
    async (userInfo: UserInfo) => {
    console.log('Fetching meetings for user:', userInfo?.uid);
    
    try {
        const q = query(
            collection(firebaseDB, 'meetings'), 
            or(
                where('createdBy', '==', userInfo?.uid),
                where('invitedUsers', 'array-contains', userInfo?.uid)
            )
        );
        console.log('Executing query with OR condition');
        const snapshot = await getDocs(q);
        console.log('Query successful, found', snapshot.docs.length, 'meetings');

        const meetingsData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
            ...data,
            meetingId: doc.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString(): new Date().toISOString(),
            } as Meeting;
        });
        console.log('Processed meetings data:', meetingsData);
        return meetingsData;
    } catch (error) {
        console.error('Error fetching meetings with OR query:', error);
        console.log('Falling back to created meetings only');
        
        const q = query(
            collection(firebaseDB, 'meetings'), 
            where('createdBy', '==', userInfo?.uid)
        );
        const snapshot = await getDocs(q);
        console.log('Fallback query successful, found', snapshot.docs.length, 'meetings');

        const meetingsData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
            ...data,
            meetingId: doc.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString(): new Date().toISOString(),
            } as Meeting;
        });
        console.log('Processed fallback meetings data:', meetingsData);
        return meetingsData;
    }
  },
)

interface MeetingsState {
  meetings: Meeting[],
  loading: boolean,
  error: string,
}

const initialState: MeetingsState = {
  meetings: [],
  loading: false,
  error: '',
}

const MeetingsSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMeetings.pending, (state) => {
       state.loading = true
       state.error = ''
    })
    builder.addCase(fetchMeetings.fulfilled, (state, action) => {
       state.loading = false
       state.meetings = action.payload
    })
     builder.addCase(fetchMeetings.rejected, (state, action) => {
       state.loading = false
       state.error = action.error.message || 'Failed to fetch meetings'
    })
  },
})

export const meetingsReducer = MeetingsSlice.reducer;
