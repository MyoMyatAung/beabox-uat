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
import exploreSlice from "./slices/exploreSlice";
import HistorySlice from "@/page/search/slice/HistorySlice";
import { searchApi } from "./api/search/searchApi";
import homeSlice from "../page/home/services/homeSlice";
import ModelSlice from "./slices/ModelSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["persist","history","explore","home"], // Reducers you want to persist
};

const rootReducer = combineReducers({
  count: counterSlice,
  [homeApi.reducerPath]: homeApi.reducer,
  profile: profileSlice,
  persist: persistSlice,
  explore: exploreSlice,
  history: HistorySlice,
  home: homeSlice,
  model : ModelSlice,
  [profileApi.reducerPath]: profileApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [walletApi.reducerPath]: walletApi.reducer,
  [exploreApi.reducerPath]: exploreApi.reducer,
  [searchApi.reducerPath]: searchApi.reducer,
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
      .concat(exploreApi.middleware)
      .concat(searchApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
