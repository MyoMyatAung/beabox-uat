import { createSlice } from "@reduxjs/toolkit";

interface VideoRenderState {
  videosToRender: any[]; // Define the type of videosToRender
}

const initialState: VideoRenderState = {
  videosToRender: [], // Initial state is an empty array
};

export const videoRenderSlice = createSlice({
  name: "videoRenderSlice",
  initialState,
  reducers: {
    setVideosToRender: (state, { payload }) => {
      // Ensure the payload is an array or a serializable value
      state.videosToRender = payload;
    },
    appendVideosToRender: (state, { payload }) => {
      // Append new videos to the existing array
      state.videosToRender = [...state.videosToRender, ...payload];
    },
  },
});

export const { setVideosToRender, appendVideosToRender } =
  videoRenderSlice.actions;

export default videoRenderSlice.reducer;
