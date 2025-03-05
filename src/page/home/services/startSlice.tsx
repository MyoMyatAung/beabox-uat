import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  start: false,
};

export const startSlice = createSlice({
  name: "startSlice",
  initialState,
  reducers: {
    setStart: (state, { payload }) => {
      state.start = payload;
    },
  },
});

export const { setStart } = startSlice.actions;

export default startSlice.reducer;
