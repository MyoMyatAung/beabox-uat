// currentVideoIndexSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentVideoIndexState {
  currentVideoIndexMap: Record<string, number>;
}

const initialState: CurrentVideoIndexState = {
  currentVideoIndexMap: {},
};

export const indexSlice = createSlice({
  name: "indexSlice",
  initialState,
  reducers: {
    setCurrentVideoIndex: (
      state,
      action: PayloadAction<{ userId: string; index: number }>
    ) => {
      const { userId, index } = action.payload;
      state.currentVideoIndexMap[userId] = index || 0;
    },
    // Optional: Reset all indices
    resetCurrentVideoIndices: (state) => {
      state.currentVideoIndexMap = {};
    },
  },
});

export const { setCurrentVideoIndex, resetCurrentVideoIndices } =
  indexSlice.actions;
export default indexSlice.reducer;
