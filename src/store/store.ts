import { persistStore, persistReducer } from "redux-persist";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import counterSlice from "./slices/counterSlice";
import profileSlice from "./slices/profileSlice";
import { profileApi } from "./api/profileApi";
import { authApi } from "./api/authApi";
import persistSlice from "./slices/persistSlice";
import { walletApi } from "./api/wallet/walletApi";
import { exploreApi } from "./api/explore/exploreApi";
import { homeApi } from "../page/home/services/homeApi";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["persist"], // Reducers you want to persist
};

const rootReducer = combineReducers({
  count: counterSlice,
  [homeApi.reducerPath]: homeApi.reducer,
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
      .concat(homeApi.middleware)
      .concat(profileApi.middleware)
      .concat(authApi.middleware)
      .concat(walletApi.middleware)
      .concat(exploreApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
