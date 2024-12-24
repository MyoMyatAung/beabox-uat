import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  isDrawerOpen: false,
  defaultFollowTab: "follower",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setIsDrawerOpen: (state, { payload }) => {
      state.isDrawerOpen = payload;
    },
    setDefaultFollowTab: (state, { payload }) => {
      state.defaultFollowTab = payload;
    },
  },
});

export const { setIsDrawerOpen, setDefaultFollowTab } = profileSlice.actions;

export default profileSlice.reducer;
