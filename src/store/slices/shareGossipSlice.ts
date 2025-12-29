import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShareGossipState {
    isOpen: boolean;
    shareUrl: string;
}

const initialState: ShareGossipState = {
    isOpen: false,
    shareUrl: "",
};

export const shareGossipSlice = createSlice({
    name: "shareGossip",
    initialState,
    reducers: {
        openShareGossip: (state, action: PayloadAction<{ isOpen: boolean, shareUrl: string }>) => {
            state.isOpen = action.payload.isOpen;
            state.shareUrl = action.payload.shareUrl;
        },
        closeShareGossip: (state) => {
            state.isOpen = false;
            state.shareUrl = "";
        },
    },
});

export const { openShareGossip, closeShareGossip } = shareGossipSlice.actions;
export default shareGossipSlice.reducer;