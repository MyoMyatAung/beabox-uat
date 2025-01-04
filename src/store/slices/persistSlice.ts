import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  registerUser: null,
  user: null,
  gender: "Other",
  bio: "",
  profileData: null,
  private_profile: "off",
  visibility: "off",
  securityQues: null,
  region: null,
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
      state.securityQues = null;
    },
    setProfileData: (state, { payload }) => {
      state.profileData = payload;
    },
    setPrivateProfile: (state, { payload }) => {
      state.private_profile = payload;
    },
    setVisibility: (state, { payload }) => {
      state.visibility = payload;
    },
    setSecurityQues: (state, { payload }) => {
      state.securityQues = payload;
    },
    setRegion: (state, { payload }) => {
      state.region = payload;
    },
  },
});

export const {
  setRegisterUser,
  setUser,
  logOutUser,
  setGender,
  setBio,
  setProfileData,
  setPrivateProfile,
  setVisibility,
  setSecurityQues,
  setRegion,
} = persistSlice.actions;

export default persistSlice.reducer;
