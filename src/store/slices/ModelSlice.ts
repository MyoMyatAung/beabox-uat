import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModelState {
  panding: boolean;
}

const initialState: ModelState = {
  panding: false,
};

export const ModelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setPanding: (state, action: PayloadAction<boolean>) => {
      state.panding = action.payload;
    },
  },
});

export const { setPanding } = ModelSlice.actions;

export default ModelSlice.reducer;
