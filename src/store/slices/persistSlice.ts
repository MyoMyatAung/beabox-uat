import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  registerUser: null,
  user: null,
  gender: "Other",
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
    setGender: (state, { payload }) => {
      state.gender = payload;
    },
    logOutUser: (state) => {
      state.user = null;
    },
  },
});

export const { setRegisterUser, setUser, logOutUser, setGender } =
  persistSlice.actions;

export default persistSlice.reducer;
