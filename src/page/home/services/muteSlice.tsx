import { createSlice } from "@reduxjs/toolkit";
// Define the initial state using that type
const initialState: any = {
  mute: false,
};

export const muteSlice = createSlice({
  name: "muteSlice",
  initialState,
  reducers: {
    setMute: (state, { payload }) => {
      state.mute = payload;
    },
  },
});

export const { setMute } = muteSlice.actions;

export default muteSlice.reducer;
