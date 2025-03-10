import { createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState: any = {
  videoData: [],
};

export const previousSlice = createSlice({
  name: "previousSlice",
  initialState,
  reducers: {
    setPrevious: (state, { payload }) => {
      state.videoData = [...state.videoData, payload]; // Store data in videoData
    },
    clearPrevious: (state) => {
      state.videoData = [];
    },
    removeFirstPrevious: (state) => {
      if (state.videoData.length > 0) {
        state.videoData = state.videoData.slice(1); // Remove first item
      }
    },
  },
});

export const { setPrevious, clearPrevious, removeFirstPrevious } =
  previousSlice.actions;

export default previousSlice.reducer;
