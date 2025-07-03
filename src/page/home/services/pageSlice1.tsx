import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  page1: 1,
};

export const pageSlice1 = createSlice({
  name: "pageSlice1",
  initialState,
  reducers: {
    setPage1: (state, { payload }) => {
      state.page1 = payload;
    },
  },
});

export const { setPage1 } = pageSlice1.actions;

export default pageSlice1.reducer;
