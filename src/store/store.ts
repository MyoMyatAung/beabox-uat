import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import counterSlice from "./slices/counterSlice";
import profileSlice from "./slices/profileSlice";
import { profileApi } from "./api/profileApi";
import { authApi } from "./api/authApi";
import persistSlice from "./slices/persistSlice";
import { walletApi } from "./api/wallet/walletApi";
import { exploreApi } from "./api/explore/exploreApi";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["persist"], // Reducers you want to persist
};

const rootReducer = combineReducers({
  count: counterSlice,
  profile: profileSlice,
  persist: persistSlice,
  [profileApi.reducerPath]: profileApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [walletApi.reducerPath]: walletApi.reducer,
  [exploreApi.reducerPath]: exploreApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store: any = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(profileApi.middleware)
      .concat(authApi.middleware)
      .concat(walletApi.middleware)
      .concat(exploreApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
