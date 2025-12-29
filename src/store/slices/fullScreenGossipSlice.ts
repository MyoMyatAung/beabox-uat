import { GossipPostData } from "@/page/gossip/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FullScreenGossipState {
  isOpen: boolean;
  index: number;
  post: GossipPostData | null;
}

const initialState: FullScreenGossipState = {
  isOpen: false,
  index: 0,
  post: null,
};

export const fullScreenGossipSlice = createSlice({
    name: "fullScreenGossip",
    initialState,
    reducers: {
        setIsOpen: (state, action: PayloadAction<boolean>) => {
            state.isOpen = action.payload;
        },
        setIndex: (state, action: PayloadAction<number>) => {
            state.index = action.payload;
        },
        setPost: (state, action: PayloadAction<GossipPostData | null>) => {
            state.post = action.payload;
        },
        openFullScreenGossip: (state, action: PayloadAction<{ index: number, isOpen: boolean, post: GossipPostData | null}>) => {
            state.isOpen = action.payload.isOpen;
            state.index = action.payload.index;
            state.post = action.payload.post;
        },
        closeFullScreenGossip: (state) => {
            state.isOpen = false;
            state.index = 0;
            state.post = null;
        },
    },
});

export const { setIsOpen, setIndex, setPost, openFullScreenGossip, closeFullScreenGossip } = fullScreenGossipSlice.actions;
export default fullScreenGossipSlice.reducer;