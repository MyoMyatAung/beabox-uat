import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  data: [],
};

export const unlikeSlice = createSlice({
  name: "unlike",
  initialState,
  reducers: {
    setUnLike: (state, { payload }) => {
      state.data = [...state.data, payload];
    },
  },
});

export const { setUnLike } = unlikeSlice.actions;

export default unlikeSlice.reducer;
