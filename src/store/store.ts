import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slices/counterSlice";

export const store: any = configureStore({
  reducer: {
    count: counterSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
