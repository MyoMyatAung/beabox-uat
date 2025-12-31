import { GossipPostData } from "@/page/gossip/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostDetailDialogState {
  isOpen: boolean;
  postId: string | null;
  post: GossipPostData | null;
}

const initialState: PostDetailDialogState = {
  isOpen: false,
  postId: null,
  post: null,
};

export const postDetailDialogSlice = createSlice({
  name: "postDetailDialog",
  initialState,
  reducers: {
    openPostDetailDialog: (
      state,
      action: PayloadAction<{ postId: string; post: GossipPostData | null }>
    ) => {
      state.isOpen = true;
      state.postId = action.payload.postId;
      state.post = action.payload.post;
    },
    closePostDetailDialog: (state) => {
      state.isOpen = false;
      state.postId = null;
      state.post = null;
    },
  },
});

export const { openPostDetailDialog, closePostDetailDialog } =
  postDetailDialogSlice.actions;
export default postDetailDialogSlice.reducer;
