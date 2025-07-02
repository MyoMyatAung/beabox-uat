import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  currentActivePost1: null,
};

export const activeSlice1 = createSlice({
  name: "activeslice1",
  initialState,
  reducers: {
    setCurrentActivePost1: (state, { payload }) => {
      state.currentActivePost1 = payload;
    },
  },
});

export const { setCurrentActivePost1 } = activeSlice1.actions;

export default activeSlice1.reducer;
