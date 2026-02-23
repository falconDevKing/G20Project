import { type AnyAction, combineReducers, configureStore, type Reducer } from "@reduxjs/toolkit";
import appSlice from "./appSlice";
import debugSlice from "./debugSlice";
import authSlice from "./authSlice";
import paymentSlice from "./paymentSlice";
import { safeStorage } from "./safeStorage";
// import storage from "redux-persist/lib/storage";

import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

// const kycPersistConfig = {
//   key: 'companyKyc',
//   storage,
//   whitelist: [],
// }

const authPersistConfig = {
  key: "auth",
  storage: safeStorage,
  // storage,
};

const allReducers = combineReducers({
  app: appSlice,
  payment: paymentSlice,
  debug: debugSlice,
  auth: persistReducer(authPersistConfig, authSlice),
  // auth: authSlice,
});

const rootReducer: Reducer<RootState> = (state: RootState | undefined, action: AnyAction) => {
  // clears all states upon logout
  if (action.type === "auth/setLogOut") {
    safeStorage.removeItem("persist:auth");
  }
  return allReducers(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: true,
});

export type RootState = ReturnType<typeof allReducers>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;
