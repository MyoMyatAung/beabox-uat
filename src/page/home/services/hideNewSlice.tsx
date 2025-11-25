import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  hideNew: false,
};

export const hideNewSlice = createSlice({
  name: "hideNewSlice",
  initialState,
  reducers: {
    sethideNew: (state, { payload }) => {
      state.hideNew = payload;
    },
  },
});

export const { sethideNew } = hideNewSlice.actions;

export default hideNewSlice.reducer;
