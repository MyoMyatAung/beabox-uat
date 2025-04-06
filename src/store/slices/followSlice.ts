// features/follow/followSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FollowState {
  status: Record<string, boolean>; // { userId: isFollowing }
}

const initialState: FollowState = {
  status: {},
};

export const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    setFollowStatus: (
      state,
      action: PayloadAction<{ userId: string; isFollowing: boolean }>
    ) => {
      state.status[action.payload.userId] = action.payload.isFollowing;
    },
    initializeFollowStatuses: (
      state,
      action: PayloadAction<Array<{ id: string; is_followed: boolean }>>
    ) => {
      action.payload.forEach((user) => {
        state.status[user.id] = user.is_followed;
      });
    },
    clearFollowStatuses: () => initialState,
  },
});

export const {
  setFollowStatus,
  initializeFollowStatuses,
  clearFollowStatuses,
} = followSlice.actions;
export default followSlice.reducer;
