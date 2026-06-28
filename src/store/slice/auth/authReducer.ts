import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    resetAuth: (state) => {
      state.isLoggedIn = false;
    },
  },
});

export const { setIsLoggedIn, resetAuth } = authSlice.actions;

export default authSlice.reducer;