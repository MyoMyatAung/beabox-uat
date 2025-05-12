import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  isDrawerOpen: false,
  defaultFollowTab: "follower",
  authToggle: true,
  showAlert: false,
  alertText: "",
  sort: "created_at",
  recycleRefetch: false,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setRecycleRefetch: (state, { payload }) => {
      state.recycleRefetch = payload;
    },
    setSort: (state, { payload }) => {
      state.sort = payload;
    },
    setAuthToggle: (state, { payload }) => {
      state.authToggle = payload;
    },
    setIsDrawerOpen: (state, { payload }) => {
      state.isDrawerOpen = payload;
    },
    setDefaultFollowTab: (state, { payload }) => {
      state.defaultFollowTab = payload;
    },
    setShowAlert: (state, { payload }) => {
      state.showAlert = payload;
    },
    setAlertText: (state, { payload }) => {
      state.alertText = payload;
    },
  },
});

export const {
  setSort,
  setIsDrawerOpen,
  setDefaultFollowTab,
  setAuthToggle,
  setShowAlert,
  setAlertText,
  setRecycleRefetch,
} = profileSlice.actions;

export default profileSlice.reducer;
