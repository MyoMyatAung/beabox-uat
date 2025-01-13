import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  currentTab: 2,
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setCurrentTab: (state, { payload }) => {
      state.currentTab = payload;
    },
  },
});

export const { setCurrentTab } = homeSlice.actions;

export default homeSlice.reducer;
