import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  registerUser: null,
  user: null,
};

export const persistSlice = createSlice({
  name: "persist",
  initialState,
  reducers: {
    setRegisterUser: (state, { payload }) => {
      state.registerUser = payload;
    },
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    logOutUser: (state) => {
      state.user = null;
    },
  },
});

export const { setRegisterUser, setUser, logOutUser } = persistSlice.actions;

export default persistSlice.reducer;
