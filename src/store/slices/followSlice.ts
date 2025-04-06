// store/slices/followSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FollowState {
  status: Record<string, boolean>; // userId -> isFollowing
  pending: Record<string, boolean>; // userId -> isUpdating
}

const initialState: FollowState = {
  status: {},
  pending: {},
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
      state.status[userId] = isFollowing;
    },
    setPendingStatus: (
      state,
      action: PayloadAction<{ userId: string; isPending: boolean }>
    ) => {
      const { userId, isPending } = action.payload;
      state.pending[userId] = isPending;
    },
    clearFollowStatus: (state) => {
      state.status = {};
      state.pending = {};
    },
  },
});

export const { setFollowStatus, setPendingStatus, clearFollowStatus } =
  followSlice.actions;
export default followSlice.reducer;
