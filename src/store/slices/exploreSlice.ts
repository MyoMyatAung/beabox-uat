import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  files: [],
  title: "",
  more_tab: "",
  exp_header: "Recommend",
};

export const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {
    setDetails: (state, { payload }) => {
      state.files = payload;
    },
    setTitle: (state, { payload }) => {
      state.title = payload;
    },
    setMoreTab: (state, { payload }) => {
      state.more_tab = payload;
    },
    setExpHeader: (state, { payload }) => {
      state.exp_header = payload;
    },
  },
});

export const { setDetails, setTitle, setMoreTab, setExpHeader } =
  exploreSlice.actions;

export default exploreSlice.reducer;
