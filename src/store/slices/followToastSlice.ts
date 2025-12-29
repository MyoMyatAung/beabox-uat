import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FollowToastState {
  isOpen: boolean;
  isFollowed: boolean;
}

const initialState: FollowToastState = {
  isOpen: false,
  isFollowed: false,
};

export const followToastSlice = createSlice({
  name: "followToast",
  initialState,
  reducers: {
    showFollowToast: (state, action: PayloadAction<{ isFollowed: boolean }>) => {
      state.isOpen = true;
      state.isFollowed = action.payload.isFollowed;
    },
    hideFollowToast: (state) => {
      state.isOpen = false;
    },
  },
});

export const { showFollowToast, hideFollowToast } = followToastSlice.actions;
export default followToastSlice.reducer;

