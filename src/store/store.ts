import { persistStore, persistReducer } from "redux-persist";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import counterSlice from "./slices/counterSlice";
import profileSlice from "./slices/profileSlice";
import { Storage } from "redux-persist";
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
import errorSlice from "@/page/home/services/errorSlice";
import unlikeSlice from "@/page/home/services/unlikeSlice";
import activeSlice from "@/page/home/services/activeSlice";
import videoSlice from "@/page/home/services/videosSlice";
import pageSlice from "@/page/home/services/pageSlice";
import muteSlice from "@/page/home/services/muteSlice";
import loaderSlice from "@/page/home/services/loaderSlice";
import hideBarSlice from "@/page/home/services/hideBarSlice";
import { versionApi } from "./api/versionApi";
import previousSlice from "@/page/home/services/previousSlice";
import videoRenderSlice from "@/page/home/services/videoRenderSlice";
import startSlice from "@/page/home/services/startSlice";
import createCenterSlice from "./slices/createCenterSlice";
import { createCenterApi } from "./api/createCenterApi";
import playSlice from "@/page/home/services/playSlice";
import scrollSlice from "@/page/home/services/scrollSlice";
import followSlice from "./slices/followSlice";
import eventSlice from "./slices/eventSlice";
import { eventApi } from "./api/events/eventApi";
import { eventInvitationApi } from "../page/event/eventApi";
import spinWheelReducer from "./slices/spinWheelSlice";
import { spinWheelApi } from "../page/luckywheel/services/spinWheelApi";
import showSlice from "@/page/home/services/showSlice";
import watchSlice from "@/page/home/services/watchSlice";
import indexSlice from "@/page/home/services/indexSlice";
import previousUserReducer from "@/page/home/services/previousUserSlice";

const sessionStorageWrapper: Storage = {
  getItem: (key: string) => {
    return new Promise<string | null>((resolve) => {
      const item = sessionStorage.getItem(key);
      resolve(item);
    });
  },
  setItem: (key: string, value: string) => {
    return new Promise<void>((resolve) => {
      sessionStorage.setItem(key, value);
      resolve();
    });
  },
  removeItem: (key: string) => {
    return new Promise<void>((resolve) => {
      sessionStorage.removeItem(key);
      resolve();
    });
  },
};

const persistHomeSliceConfig = {
  key: "home",
  storage: sessionStorageWrapper, // Use sessionStorage instead of default localStorage
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["persist", "history", "explore", "unlike", "event"], // Reducers you want to persist
};

const rootReducer = combineReducers({
  count: counterSlice,
  [homeApi.reducerPath]: homeApi.reducer,
  profile: profileSlice,
  persist: persistSlice,
  playSlice: playSlice,
  showSlice: showSlice,
  explore: exploreSlice,
  scrollSlice: scrollSlice,
  indexSlice: indexSlice,
  watchSlice: watchSlice,
  history: HistorySlice,
  startSlice: startSlice,
  previousUser: previousUserReducer,

  hideBarSlice: hideBarSlice,
  follow: followSlice,
  home: persistReducer(persistHomeSliceConfig, homeSlice), // Apply sessionStorage for homeSlice
  model: ModelSlice,
  previousSlice: previousSlice,
  videoRenderSlice: videoRenderSlice,
  unlike: unlikeSlice,
  errorslice: errorSlice,
  activeslice: activeSlice,
  videoSlice: videoSlice,
  pageSlice: pageSlice,
  muteSlice: muteSlice,
  loaderSlice: loaderSlice,
  createCenter: createCenterSlice,
  [profileApi.reducerPath]: profileApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [walletApi.reducerPath]: walletApi.reducer,
  [exploreApi.reducerPath]: exploreApi.reducer,
  [searchApi.reducerPath]: searchApi.reducer,
  [createCenterApi.reducerPath]: createCenterApi.reducer,
  event: eventSlice,
  [eventApi.reducerPath]: eventApi.reducer,
  [eventInvitationApi.reducerPath]: eventInvitationApi.reducer,
  [versionApi.reducerPath]: versionApi.reducer,
  [spinWheelApi.reducerPath]: spinWheelApi.reducer,
  spinWheel: spinWheelReducer,
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
      .concat(searchApi.middleware)
      .concat(createCenterApi.middleware)
      .concat(eventApi.middleware)
      .concat(eventInvitationApi.middleware)
      .concat(versionApi.middleware)
      .concat(spinWheelApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
