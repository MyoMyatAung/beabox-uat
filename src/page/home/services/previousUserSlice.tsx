// features/previousUserSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface PreviousUserState {
  data: any;
}

const initialState: PreviousUserState = {
  data: null,
};

const previousUserSlice = createSlice({
  name: "previousUser",
  initialState,
  reducers: {
    setPreviousUser: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setPreviousUser } = previousUserSlice.actions;
export default previousUserSlice.reducer;
