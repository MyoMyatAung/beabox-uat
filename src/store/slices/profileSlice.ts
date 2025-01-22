import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  isDrawerOpen: false,
  defaultFollowTab: "follower",
  authToggle: true,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setAuthToggle: (state, { payload }) => {
      state.authToggle = payload;
    },
    setIsDrawerOpen: (state, { payload }) => {
      state.isDrawerOpen = payload;
    },
    setDefaultFollowTab: (state, { payload }) => {
      state.defaultFollowTab = payload;
    },
  },
});

export const { setIsDrawerOpen, setDefaultFollowTab, setAuthToggle } = profileSlice.actions;

export default profileSlice.reducer;
