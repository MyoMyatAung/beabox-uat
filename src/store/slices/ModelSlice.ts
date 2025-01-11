import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  panding: false,
};

export const ModelSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setPanding: (state, action) => {
      state.panding = action.payload;
    },
  },
});

export const { setPanding } = ModelSlice.actions;

export default ModelSlice.reducer;
