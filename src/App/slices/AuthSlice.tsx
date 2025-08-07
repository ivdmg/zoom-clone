import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface UserInfo {
  uid: string;
  email: string | null;
  name: string | null;
}

export interface AuthState {
  userInfo: UserInfo | undefined;
}

const AuthIntialState: AuthState = {
  userInfo: undefined,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: AuthIntialState,
  reducers: {
    setUser:(state, action: PayloadAction<UserInfo | undefined>) => {
      state.userInfo = action.payload;
    }
  },
})


export const { setUser } = authSlice.actions;
export default authSlice.reducer