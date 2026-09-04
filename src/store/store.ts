import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from 'redux-persist';
import { storage } from "../storage/mmkv";
import remindersReducer from "./slice/reminders/remindersSlice";

let reactotron: any;

if (__DEV__) {
  reactotron = require('../config/ReactotronConfig').default;
}

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['reminders'],
};

const rootReducer = combineReducers({
  reminders: remindersReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
  enhancers: (getDefaultEnhancers) =>
    __DEV__ && reactotron.createEnhancer
      ? getDefaultEnhancers().concat(reactotron.createEnhancer())
      : getDefaultEnhancers(),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
