// watchedPostsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WatchedPostsState {
  watchedPostsMap: Record<string, Record<string, boolean>>;
}

const initialState: WatchedPostsState = {
  watchedPostsMap: {},
};

const watchSlice = createSlice({
  name: "watchSlice",
  initialState,
  reducers: {
    setWatchedPost(
      state,
      action: PayloadAction<{
        userId: string;
        postId: string;
        watched: boolean;
      }>
    ) {
      const { userId, postId, watched } = action.payload;
      if (!state.watchedPostsMap[userId]) {
        state.watchedPostsMap[userId] = {};
      }
      state.watchedPostsMap[userId][postId] = watched;
    },
    // Optional: Add other reducers if needed (e.g., bulk update)
  },
});

export const { setWatchedPost } = watchSlice.actions;
export default watchSlice.reducer;
