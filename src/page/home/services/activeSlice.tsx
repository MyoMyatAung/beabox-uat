import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  currentActivePost: null,
};

export const activeSlice = createSlice({
  name: "activeslice",
  initialState,
  reducers: {
    setCurrentActivePost: (state, { payload }) => {
      state.currentActivePost = payload;
    },
  },
});

export const { setCurrentActivePost } = activeSlice.actions;

export default activeSlice.reducer;
