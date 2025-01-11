import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
 files : [],
 tabs : 1
};

export const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {
    setDetails: (state, { payload }) => {
      state.files = payload;
    },
  },
});

export const { setDetails } = exploreSlice.actions;

export default exploreSlice.reducer;
