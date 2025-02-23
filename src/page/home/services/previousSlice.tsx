import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  data: [],
};

export const previousSlice = createSlice({
  name: "previous",
  initialState,
  reducers: {
    setPrevious: (state, { payload }) => {
      console.log(payload);
      state.data = [...state.data, payload];
    },
    removeFirstThree: (state) => {
      state.data = state.data.slice(3); // Remove the first three elements
    },
  },
});

export const { setPrevious, removeFirstThree } = previousSlice.actions;

export default previousSlice.reducer;
