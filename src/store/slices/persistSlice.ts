import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  registerUser: null,
  user: null,
  gender: "Other",
  bio: "",
  profileData: null,
  private_profile: "off",
  visibility: "",
  securityQues: null,
  region: null,
  cover: null,
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
      state.profileData = null;
      state.gender = "Other";
      state.cover = null;
      state.visibility = "";
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
    setCover: (state, { payload }) => {
      state.cover = payload;
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
  setCover,
} = persistSlice.actions;

export default persistSlice.reducer;
