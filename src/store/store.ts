import { configureStore, combineReducers } from "@reduxjs/toolkit";
import counterSlice from "./slices/counterSlice";
import { homeApi } from "../page/home/services/homeApi";

const rootReducer = combineReducers({
  count: counterSlice,
  [homeApi.reducerPath]: homeApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(homeApi.middleware),
});
