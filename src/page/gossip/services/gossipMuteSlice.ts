import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GossipMuteState {
  // Map of post_id -> muted state
  mutedByPostId: Record<string, boolean>;
  // Mute all
  muteAll: boolean;
}

const initialState: GossipMuteState = {
  mutedByPostId: {},
  muteAll: false,
};

export const gossipMuteSlice = createSlice({
  name: "gossipMute",
  initialState,
  reducers: {
    setPostMuted: (
      state,
      action: PayloadAction<{ postId: string; muted: boolean }>
    ) => {
      state.mutedByPostId[action.payload.postId] = action.payload.muted;
    },
    togglePostMuted: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const currentMuted = state.mutedByPostId[postId] ?? true; // Default to muted
      state.mutedByPostId[postId] = !currentMuted;
    },
    // Clear muted state for a specific post (useful for cleanup)
    clearPostMuted: (state, action: PayloadAction<string>) => {
      delete state.mutedByPostId[action.payload];
    },
    setMuteAll: (state, action: PayloadAction<boolean>) => {
      state.muteAll = action.payload;
    },
  },
});

export const { setPostMuted, togglePostMuted, clearPostMuted, setMuteAll } =
  gossipMuteSlice.actions;

export default gossipMuteSlice.reducer;

