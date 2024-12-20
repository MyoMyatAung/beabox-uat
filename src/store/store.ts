import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slices/counterSlice";
import profileSlice from "./slices/profileSlice";

export const store: any = configureStore({
  reducer: {
    count: counterSlice,
    profile: profileSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
