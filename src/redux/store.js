import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import authReducers from "./reducers/authReducers";
import searchReducers from "./reducers/searchReducers";
import ticketReducers from "./reducers/ticketReducers";
import notifReducers from "./reducers/notificationReducers";

// import functionReducers from "./reducers/functionReducers";

const rootReducers = combineReducers({
  auth: authReducers,
  search: searchReducers,
  ticket: ticketReducers,
  notifications: notifReducers,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(thunk),
});

export const persistor = persistStore(store);
