import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface AppState {
  isFirstTimeUser: boolean;
  showUserGuide: boolean;
}

// Define the initial state using that type
const initialState: AppState = {
  isFirstTimeUser: true,
  showUserGuide: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setFirstTimeUser: (state, action: PayloadAction<boolean>) => {
      state.isFirstTimeUser = action.payload;
    },
    setShowUserGuide: (state, action: PayloadAction<boolean>) => {
      state.showUserGuide = action.payload;
    },
  },
});

export const { setFirstTimeUser, setShowUserGuide } = appSlice.actions;

export default appSlice.reducer;
