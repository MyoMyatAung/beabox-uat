import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  bottomLoader: false,
};

export const loaderSlice = createSlice({
  name: "loaderSlice",
  initialState,
  reducers: {
    setBottomLoader: (state, { payload }) => {
      state.bottomLoader = payload;
    },
  },
});

export const { setBottomLoader } = loaderSlice.actions;

export default loaderSlice.reducer;
