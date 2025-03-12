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
  forgotData: null,
  forgotToken: null,
  authToggle: true,
  content_visibility: "",
  sanswer: "",
  defaultTab: "upload",
  defaultTab2: "video",
};

export const persistSlice = createSlice({
  name: "persist",
  initialState,
  reducers: {
    setDefaultTab: (state, { payload }) => {
      state.defaultTab = payload;
    },
    setDefaultTab2: (state, { payload }) => {
      state.defaultTab2 = payload;
    },
    setSAnswer: (state, { payload }) => {
      state.sanswer = payload;
    },
    setCVisibility: (state, { payload }) => {
      state.content_visibility = payload;
    },
    setAuthToggle: (state, { payload }) => {
      state.authToggle = payload;
    },
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
      state.region = null;
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
    setForgotData: (state, { payload }) => {
      state.forgotData = payload;
    },
    setForgotToken: (state, { payload }) => {
      state.forgotToken = payload;
    },
  },
});

export const {
  setDefaultTab,
  setDefaultTab2,
  setCVisibility,
  setAuthToggle,
  setForgotToken,
  setForgotData,
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
  setSAnswer,
} = persistSlice.actions;

export default persistSlice.reducer;
