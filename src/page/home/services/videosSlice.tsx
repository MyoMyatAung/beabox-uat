import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  videos: {
    follow: [],
    foryou: [],
  },
};

export const videoSlice = createSlice({
  name: "videoSlice",
  initialState,
  reducers: {
    setVideos: (state, { payload }) => {
      state.videos = payload; // Directly assign the array to the state
    },
  },
});

export const { setVideos } = videoSlice.actions;

export default videoSlice.reducer;
