// store/slices/followSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FollowState {
  followStatus: Record<string, boolean>; // userId -> isFollowing
}

const initialState: FollowState = {
  followStatus: {},
};

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    setFollowStatus: (
      state,
      action: PayloadAction<{ userId: string; isFollowing: boolean }>
    ) => {
      const { userId, isFollowing } = action.payload;
      state.followStatus[userId] = isFollowing;
    },
    clearFollowStatus: (state) => {
      state.followStatus = {};
    },
  },
});

export const { setFollowStatus, clearFollowStatus } = followSlice.actions;
export default followSlice.reducer;
