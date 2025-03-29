// src/store/slice/scrollSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface ScrollState {
  positions: Record<string, number>; // Store scroll positions by route key
}

const initialState: ScrollState = {
  positions: {},
};

const scrollSlice = createSlice({
  name: "scrollSlice",
  initialState,
  reducers: {
    saveScrollPosition: (state, action) => {
      const { path, position } = action.payload;
      state.positions[path] = position;
    },
    clearScrollPosition: (state, action) => {
      const { path } = action.payload;
      delete state.positions[path];
    },
  },
});

export const { saveScrollPosition, clearScrollPosition } = scrollSlice.actions;
export default scrollSlice.reducer;
