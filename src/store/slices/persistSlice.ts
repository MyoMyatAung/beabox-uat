import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  registerUser: null,
  user: null,
  gender: "Other",
  bio: "",
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
    setBio: (state, { payload }) => {
      state.bio = payload;
    },
    logOutUser: (state) => {
      state.user = null;
    },
  },
});

export const { setRegisterUser, setUser, logOutUser, setGender, setBio } =
  persistSlice.actions;

export default persistSlice.reducer;
