import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  isSelect: false,
};

export const createCenterSlice = createSlice({
  name: "createcenter",
  initialState,
  reducers: {
    setIsSelect: (state, { payload }) => {
      state.isSelect = payload;
    },
  },
});

export const { setIsSelect } = createCenterSlice.actions;

export default createCenterSlice.reducer;
