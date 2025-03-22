import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  playstart: false,
};

export const playSlice = createSlice({
  name: "playSlice",
  initialState,
  reducers: {
    setPlay: (state, { payload }) => {
      state.playstart = payload;
    },
  },
});

export const { setPlay } = playSlice.actions;

export default playSlice.reducer;
