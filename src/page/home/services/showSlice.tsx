import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  show: false,
};

export const showSlice = createSlice({
  name: "showSlice",
  initialState,
  reducers: {
    setShow: (state, { payload }) => {
      state.show = payload;
    },
  },
});

export const { setShow } = showSlice.actions;

export default showSlice.reducer;
