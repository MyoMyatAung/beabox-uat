import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  page: 1,
};

export const pageSlice = createSlice({
  name: "pageSlice",
  initialState,
  reducers: {
    setPage: (state, { payload }) => {
      state.page = payload;
      //   if (typeof payload === "function") {
      //     // If payload is a function, treat it like a callback
      //     state.page = payload(state.page);
      //   } else {
      //     // Otherwise, replace the state with the new value
      //     state.page = payload;
      //   }
    },
  },
});

export const { setPage } = pageSlice.actions;

export default pageSlice.reducer;
