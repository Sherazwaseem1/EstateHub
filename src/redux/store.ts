import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default to localStorage for web
import counterReducer from "./counter/counterSlice";
import userReducer from "./user/userSlice";
import propertyReducer from "./Current_Property/currentProperty";

// Configuration for redux-persist
const persistConfig = {
  key: 'root', // Key to save the persisted state under in storage
  storage, // Use localStorage to persist data
};

// Combine your slice reducers into a root reducer
const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
  currentProperty: propertyReducer, // Add the property reducer
});

// Apply persistReducer to your rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check to avoid issues with redux-persist
    }),
});

// Create a persistor for the store
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
