import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slices/counterSlice";
import profileSlice from "./slices/profileSlice";
import { profileApi } from "./api/profileApi";

export const store: any = configureStore({
  reducer: {
    count: counterSlice,
    profile: profileSlice,
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(profileApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
