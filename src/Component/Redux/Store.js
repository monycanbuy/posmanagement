import {  combineReducers, configureStore } from "@reduxjs/toolkit";
import { CustomerReducer } from "./Reducer";
import { thunk } from "redux-thunk";
import logger from "redux-logger";

const rootReducer = combineReducers({
    customer: CustomerReducer,
  });
  
  const customerstore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk, logger),
  });
export default customerstore