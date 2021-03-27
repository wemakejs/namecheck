import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
} from "react-redux";

import { settingSlice } from "./slices/settingSlice";
import { usernameSlice } from "./slices/usernameSlice";

const middleware = [];
if (process.env.NODE_ENV === "development") {
  const { createLogger } = require("redux-logger");
  middleware.push(createLogger());
}

export const store = configureStore({
  reducer: combineReducers({
    setting: settingSlice.reducer,
    username: usernameSlice.reducer,
  }),
  middleware,
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useDispatch = () => useDispatchBase<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase;
